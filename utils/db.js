import { MongoClient } from "mongodb";

class DBClient {
  constructor() {
    const host = process.env.DB_HOST ? process.env.DB_HOST : "localhost";
    const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    const database = process.env.DB_DATABASE ? process.env.DB_DATABASE : "files_manager";
    this.isConnected = false;
    this.client = new MongoClient(`mongodb://${host}:${port}/${database}`);
    this.client.connect().then(() => {
        this.isConnected = true;
    }).catch((error) => {
        this.isConnected = false;
        console.log(error);
    })
}

  isAlive() {
    return this.client.isConnected;
  }

  async nbUsers() {
    const db = this.client.db();
    const collection = db.collection("users");
    try {
        const userNb = await collection.countDocuments();
        return userNb;
    } catch(error) {
        return
    }
  }

  async nbFiles() {
    const db = this.client.db();
    const collection = db.collection("files");
    try {
        const fileNb = await collection.countDocuments();
        return userNb;
    } catch(error) {
        return
    }
  }
}

const dbClient = new DBClient();

export default dbClient;
