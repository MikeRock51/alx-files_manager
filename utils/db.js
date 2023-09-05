// eslint-disable-next-line import/no-extraneous-dependencies
// import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    const database = process.env.DB_DATABASE
      ? process.env.DB_DATABASE
      : 'files_manager';
    this.isConnected = false;
    this.client = new MongoClient(`mongodb://${host}:${port}/${database}`);
    // const password = process.env.DB_PASSWORD;
    // console.log(password);
    // const uri = `mongodb+srv://MikeRock:${password}@mikerockmongo.v3sevrb.mongodb.net/${database}?retryWrites=true&w=majority`;
    // this.client = new MongoClient(uri, {
    //   serverApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    //   },
    // });

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

  async fetchUserByEmail(email) {
    const collection = this.client.db().collection('users');
    const response = await collection.findOne(email);
    return response;
  }

  async createUser(user) {
    const collection = this.client.db().collection('users');
    const response = await collection.insertOne(user);
    return response.insertedId.toString();
  }

  async fetchUserByID(userID) {
    const collection = this.client.db().collection('users');
    const user = await collection.findOne({ _id: new ObjectId(userID) });
    return user;
  }

  async fetchFileByParentID(parentId) {
    const collection = this.client.db().collection('files');
    const file = await collection.findOne({ _id: new ObjectId(parentId) });
    return file;
  }

  async createFile(fileInfo) {
    const collection = this.client.db().collection('files');
    const file = await collection.insertOne(fileInfo);
    return file.insertedId;
  }
}

const dbClient = new DBClient();

export default dbClient;
