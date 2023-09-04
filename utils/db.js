// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoClient, ServerApiVersion } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    const database = process.env.DB_DATABASE
      ? process.env.DB_DATABASE
      : 'files_manager';
    this.isConnected = false;
    // this.client = new MongoClient(`mongodb://${host}:${port}/${database}`);
    const password = process.env.DB_PASSWORD;
    const uri = `mongodb+srv://MikeRock:${password}@mikerockmongo.v3sevrb.mongodb.net/?retryWrites=true&w=majority/${database}`;
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    this.client
      .connect()
      .then(() => {
        this.isConnected = true;
      })
      .catch((error) => {
        this.isConnected = false;
        console.log(error);
      });
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    const db = this.client.db();
    const collection = db.collection('users');
    const userNb = await collection.countDocuments();
    return userNb;
  }

  async nbFiles() {
    const db = this.client.db();
    const collection = db.collection('files');
    const fileNb = await collection.countDocuments();
    return fileNb;
  }
}

const dbClient = new DBClient();

export default dbClient;
