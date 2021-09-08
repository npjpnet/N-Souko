import { countReset } from 'console';
import * as Mongo from 'mongodb';
import { PrefixUnaryOperator } from 'typescript';
// const Mongo = require('mongodb');

export const genre = [
  'broadcast',
  'pa',
  'venue',
  'pr',
  'transpotation',
  'oa',
  'other',
];
export type Genre = typeof genre[number];

export const deviceStatus = ['available', 'failure', 'reparing', 'remove'];
export type DeviceStatus = typeof deviceStatus[number];

export type Storage = {
  _id: Mongo.ObjectId;
  name: string;
};

export type Container = {
  _id: Mongo.ObjectId;
  storageId: string;
  code?: string;
  name: string;
};

export type Product = {
  _id: Mongo.ObjectId;
  genre: Genre;
  name: string;
  maker: {
    name: string;
  };
};

export type Device = {
  _id: Mongo.ObjectId;
  productId: string;
  containerId: string;
  code?: string;
  status: DeviceStatus;
  serialNumber: string;
  remarks: string;
};

export class Db {
  private _db!: Mongo.Db;

  private _dbUri: string;
  private _dbName: string;

  constructor(dbUri: string, dbName: string) {
    this._dbUri = dbUri;
    this._dbName = dbName;
  }

  public async start(): Promise<void> {
    this._db = (
      await Mongo.MongoClient.connect(this._dbUri).catch((err) => {
        throw err;
      })
    ).db(this._dbName);
  }

  public async addStorage(o: { name: string }): Promise<Mongo.ObjectId> {
    const result = await this._db
      .collection<Storage>('storages')
      .insertOne(o)
      .catch((err) => {
        throw err;
      });

    return result.insertedId;
  }

  public async addContainer(o: {
    storageId: string;
    name: string;
  }): Promise<{ containerId: Mongo.ObjectId; code: string }> {
    const containerId = await this._createContainer(o);
    const count = await this._countContainers();
    const code = this._generate4DigitCode(count);

    this._applyContainerCode(containerId, code);
    return { containerId, code };
  }

  private async _createContainer(o: {
    storageId: string;
    name: string;
  }): Promise<Mongo.ObjectId> {
    const result = await this._db
      .collection<Container>('containers')
      .insertOne(o)
      .catch((err) => {
        throw err;
      });

    return result.insertedId;
  }

  private async _countContainers(): Promise<number> {
    const containers = await this._db
      .collection<Container>('containers')
      .find({})
      .toArray();

    return containers.length;
  }

  private async _applyContainerCode(
    containerId: Mongo.ObjectId,
    code: string
  ): Promise<void> {
    this._db
      .collection<Container>('containers')
      .updateOne({ _id: containerId }, { $set: { code } });
  }

  public async addProduct(o: {
    name: string;
    maker: { name: string };
    genre: Genre;
  }): Promise<Mongo.ObjectId> {
    const result = await this._db
      .collection<Product>('products')
      .insertOne(o)
      .catch((err) => {
        throw err;
      });

    return result.insertedId;
  }

  public async addDevice(o: {
    productId: string;
    containerId: string;
    status: DeviceStatus;
    serialNumber: string;
    remarks: string;
  }): Promise<{ deviceId: Mongo.ObjectId; code: string }> {
    const deviceId = await this._createDevice(o);
    const count = await this._countDevices();
    const code = this._generate4DigitCode(count);

    this._applyDeviceCode(deviceId, code);
    return { deviceId, code };
  }

  private async _createDevice(o: {
    productId: string;
    containerId: string;
    status: DeviceStatus;
    serialNumber: string;
    remarks: string;
  }): Promise<Mongo.ObjectId> {
    const result = await this._db
      .collection<Device>('devices')
      .insertOne(o)
      .catch((err) => {
        throw err;
      });

    return result.insertedId;
  }

  private async _countDevices(): Promise<number> {
    const containers = await this._db
      .collection<Device>('devices')
      .find({})
      .toArray();

    return containers.length;
  }

  private async _applyDeviceCode(
    deviceId: Mongo.ObjectId,
    code: string
  ): Promise<void> {
    this._db
      .collection<Device>('devices')
      .updateOne({ _id: deviceId }, { $set: { code } });
  }

  private _generate4DigitCode(id: number): string {
    return ('000000' + id).slice(-6);
  }

  public async getContainerWithCode(containerCode: string): Promise<{
    container: Container | null;
    devices: Device[];
  }> {
    const container = await this._db
      .collection<Container>('containers')
      .findOne({ code: containerCode }, { sort: { _id: -1 } });

    if (!container) {
      throw new Error(`${containerCode} container not found`);
    }
    console.log({ containerId: container._id.toHexString() });

    const devices = await this._db
      .collection<Device>('devices')
      .find({ containerId: container._id.toHexString() })
      .toArray();

    return {
      container,
      devices,
    };
  }

  public async getProductWithId(productId: string): Promise<Product | null> {
    const product = await this._db
      .collection<Product>('products')
      .findOne({ _id: new Mongo.ObjectId(productId) });

    return product;
  }

  public async getDeviceWithCode(deviceCode: string): Promise<Device | null> {
    const device = await this._db
      .collection<Device>('devices')
      .findOne({ code: deviceCode });

    return device;
  }

  public async findProductsWithQuery(
    query: Mongo.Filter<Product>
  ): Promise<Product[]> {
    const products = await this._db
      .collection<Product>('products')
      .find(query)
      .toArray();

    return products;
  }
}
