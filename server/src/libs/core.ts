import Mongo, { MongoClient } from 'mongodb';

export default class Core {
  private _db!: Mongo.Db;

  private _dbUri: string;
  private _dbName: string;

  constructor(dbUri: string, dbName: string) {
    this._dbUri = dbUri;
    this._dbName = dbName;
  }

  public start(): void {
    Mongo.MongoClient.connect(this._dbUri)
      .then((mongo: MongoClient) => {
        this._db = mongo.db(this._dbName);
        return;
      })
      .catch((err) => {
        throw err;
      });
  }
}
