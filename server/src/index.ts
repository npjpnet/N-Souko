import dotenv from 'dotenv';
dotenv.config();

import Express, { NextFunction, RequestHandler } from 'express';
import cors from 'cors';

import Mongo from 'mongodb';
import {
  Db,
  Container,
  Product,
  Device,
  genre as GenreArray,
} from './libs/core';

import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

class Souko {
  private _app: Express.Application;
  private _db: Db;
  private _auth0Domain: string;

  constructor(o: {
    dbUri: string | undefined;
    dbName: string | undefined;
    auth0: { domain: string | undefined };
  }) {
    if (!o.dbUri) throw new Error('データベースURIが入力されていません。');
    if (!o.dbName) throw new Error('データベース名が入力されていません。');
    if (!o.auth0.domain)
      throw new Error('Auth0テナントドメインが入力されていません。');

    this._app = Express();
    this._db = new Db(o.dbUri, o.dbName);
    this._auth0Domain = o.auth0.domain;
  }

  public start(): void {
    this._corsMiddleware();
    this._bodyParserMiddleware();

    this._routes();

    this._db.start();
    this._app.listen(53894, () => console.log(`Port 53894 listening...`));
  }

  private _corsMiddleware(): void {
    this._app.use(cors());
  }

  private _bodyParserMiddleware(): void {
    this._app.use(Express.urlencoded({ extended: true }));
    this._app.use(Express.json());
  }

  private _routes(): void {
    this._indexRoute();

    this._addContainerRoute();
    this._getContainerWithCodeRoute();

    this._addDeviceRouteWithProductIdRoute();
    this._updateDeviceWithCodeRoute();
    this._getDeviceWithCodeRoute();

    this._addProductRoute();
    this._getProductWithIdRoute();
    this._searchProductsRoute();

    this._checkJWTRoute();
  }

  private _indexRoute(): void {
    this._app.get('/', (req: Express.Request, res: Express.Response) => {
      return res.json({ msg: 'N-Souko' });
    });
  }

  private _addContainerRoute(): void {
    this._app.post(
      '/containers',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        this._db
          .addContainer({
            storageId: req.body.storageId,
            name: req.body.name,
          })
          .then(async (o: { containerId: Mongo.ObjectId; code: string }) => {
            const storage = await this._db
              .getStorageWithId(req.body.storageId)
              .catch((err: Error) => {
                // console.log(err);
              });

            if (!storage) {
              return res.status(404).json({ error: 'storage not found' });
            }
            console.log(storage);
            return res.json({ ...o, name: req.body.name, storage });
          })
          .catch((err: Error) => {
            return res.status(503).json({ error: err.message });
          });
      }
    );
  }

  private _addProductRoute(): void {
    this._app.post(
      '/products',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        this._db
          .addProduct({
            name: req.body.name,
            maker: { name: req.body.name },
            genre: req.body.genre,
          })
          .then((_id: Mongo.ObjectId) => {
            return res.json({ productId: _id });
          })
          .catch((err: Error) => {
            return res.status(503).json({ error: err.message });
          });
      }
    );
  }

  private _addDeviceRouteWithProductIdRoute(): void {
    this._app.post(
      '/products/id/:productId/devices',
      ...this._withJWTMiddleware(),
      async (req: Express.Request, res: Express.Response) => {
        const container = await this._db
          .getContainerWithCode(req.body.containerCode)
          .catch((err: Error) => {
            // console.log(err);
          });

        if (!container || !container.container) {
          return res.status(404).json({ error: 'container not found' });
        }
        const containerId = container.container._id;

        this._db
          .addDevice({
            productId: req.params.productId,
            containerId: containerId.toHexString(),
            status: req.body.status,
            serialNumber: req.body.serialNumber,
            remarks: req.body.remarks,
          })
          .then(async (o: { deviceId: Mongo.ObjectId; code: string }) => {
            const product = await this._db.getProductWithId(
              req.params.productId
            );

            if (!product) {
              return res.status(404).json({ error: 'product not found' });
            }

            return res.json({
              ...o,
              productName: product.name,
            });
          })
          .catch(async (err: Error) => {
            return res.status(503).json({ error: err.message });
          });
      }
    );
  }

  private _updateDeviceWithCodeRoute(): void {
    this._app.post(
      '/devices/code/:deviceCode',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        this._db
          .updateDeviceWithCode(req.params.deviceCode, {
            status: req.body.status,
            containerCode: req.body.containerCode,
          })
          .then((o) => {
            return res.json(o);
          })
          .catch((err: Error) => {
            return res.status(404).json({ error: err.message });
          });
      }
    );
  }

  private _getContainerWithCodeRoute(): void {
    this._app.get(
      '/containers/code/:containerCode',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        this._db
          .getContainerWithCode(req.params.containerCode)
          .then(
            async (o: { container: Container | null; devices: Device[] }) => {
              if (!o.container) {
                return res.status(404).json({ error: 'container not found' });
              }

              console.log(o.container);
              const result = {
                container: o.container,
                storage: await this._db.getStorageWithId(o.container.storageId),
                devices: await Promise.all(
                  o.devices.map(async (v: Device) => {
                    return {
                      _id: v._id,
                      code: v.code,
                      status: v.status,
                      serialNumber: v.serialNumber,
                      remarks: v.remarks,
                      product: await this._db.getProductWithId(v.productId),
                    };
                  })
                ),
              };
              return res.json(result);
            }
          )
          .catch((err: Error) => {
            return res.status(404).json({ error: err.message });
          });
      }
    );
  }

  private _getProductWithIdRoute(): void {
    this._app.get(
      '/products/id/:productId',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        this._db
          .getProductWithId(req.params.productId)
          .then((o: Product | null) => {
            return res.json(o);
          });
      }
    );
  }

  private _searchProductsRoute(): void {
    this._app.get(
      '/products/search',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        const genre =
          typeof req.query.genre === 'string' &&
          GenreArray.includes(req.query.genre)
            ? { genre: req.query.genre }
            : {};

        this._db
          .findProductsWithQuery({
            $or: [
              { name: req.query.query },
              { maker: { name: req.query.query } },
            ],
            $and: [genre],
          })
          .then((o: Product[]) => {
            return res.json(o);
          })
          .catch((err) => {
            throw err;
          });
      }
    );
  }

  private _getDeviceWithCodeRoute(): void {
    this._app.get(
      '/devices/code/:deviceCode',
      ...this._withJWTMiddleware(),
      (req: Express.Request, res: Express.Response) => {
        this._db
          .getDeviceWithCode(req.params.deviceCode)
          .then(async (o: Device | null) => {
            const result = o
              ? {
                  _id: o._id,
                  code: o.code,
                  status: o.status,
                  serialNumber: o.serialNumber,
                  remarks: o.remarks,
                  product: await this._db.getProductWithId(o.productId),
                }
              : {};
            return res.json(result);
          })
          .catch((err) => {
            throw err;
          });
      }
    );
  }

  private _checkJWTRoute(): void {
    this._app.get(`/checkJWT`, ...this._withJWTMiddleware(), (req, res) => {
      return res.json({ message: 'hello jwt-world!' });
    });
  }

  private _withJWTMiddleware(): RequestHandler[] {
    return [
      jwt({
        // Dynamically provide a signing key
        // based on the kid in the header and
        // the signing keys provided by the JWKS endpoint.
        secret: jwksRsa.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${this._auth0Domain}/.well-known/jwks.json`,
        }),

        // Validate the audience and the issuer.
        audience: `https://${this._auth0Domain}/api/v2/`,
        issuer: [`https://${this._auth0Domain}/`],
        algorithms: ['RS256'],
        credentialsRequired: false,
      }),
      (req: Express.Request, res: Express.Response, next: NextFunction) => {
        if (!req.user) {
          return res.status(401).json({ error: 'unauthorized' });
        }
        next();
      },
    ];
  }
}

const souko = new Souko({
  dbUri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
  auth0: { domain: process.env.AUTH0_DOMAIN },
});
souko.start();
