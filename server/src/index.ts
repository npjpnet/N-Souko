import dotenv from 'dotenv';
dotenv.config();

import Express from 'express';
import cors from 'cors';

import Core from './libs/core';

class Souko {
  private _app: Express.Application;
  private _core: Core;

  constructor(o: { dbUri: string | undefined; dbName: string | undefined }) {
    if (!o.dbUri) throw new Error('データベースURIが入力されていません。');
    if (!o.dbName) throw new Error('データベース名が入力されていません。');

    this._app = Express();
    this._core = new Core(o.dbUri, o.dbName);
  }

  public start(): void {
    this._corsMiddleware();
    this._bodyParserMiddleware();

    this._indexRoute();

    this._core.start();
    this._app.listen(53894, () => console.log(`Port 53894 listening...`));
  }

  private _corsMiddleware(): void {
    this._app.use(cors());
  }

  private _bodyParserMiddleware(): void {
    this._app.use(Express.urlencoded({ extended: true }));
    this._app.use(Express.json());
  }

  private _indexRoute(): void {
    this._app.get('/', (req: Express.Request, res: Express.Response) => {
      return res.json({ msg: 'N-Souko' });
    });
  }
}

const souko = new Souko({
  dbUri: process.env.DB_URI,
  dbName: process.env.DB_NAME,
});
souko.start();
