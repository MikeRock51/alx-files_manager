// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
// import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    const database = process.env.DB_DATABASE
      ? process.env.DB_DATABASE
      : 'files_manager';
    this.isConnected = false;
    this.filesCollection = null;
    this.usersCollection = null;
    // this.client = new MongoClient(`mongodb://${host}:${port}/${database}`);
    const password = process.env.DB_PASSWORD;
    console.log(password);
    const uri = `mongodb+srv://MikeRock:${password}@mikerockmongo.v3sevrb.mongodb.net/${database}?retryWrites=true&w=majority`;
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
        this.filesCollection = this.client.db().collection('files');
        this.usersCollection = this.client.db().collection('users');
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
    const userNb = await this.usersCollection.countDocuments();
    return userNb;
  }

  async nbFiles() {
    const fileNb = await this.usersCollection.countDocuments();
    return fileNb;
  }

  async fetchUserByEmail(email) {
    const response = await this.usersCollection.findOne(email);
    return response;
  }

  async createUser(user) {
    const response = await this.usersCollection.insertOne(user);
    return response.insertedId.toString();
  }

  async fetchUserByID(userID) {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(userID) });
    return user;
  }

  async fetchFileByParentID(parentId) {
    const file = await this.filesCollection.findOne({ _id: new ObjectId(parentId) });
    return file;
  }

  async createFile(fileInfo) {
    const file = await this.filesCollection.insertOne(fileInfo);
    return file.insertedId;
  }

  async fetchFileByID(fileID) {
    const file = await this.filesCollection.findOne({ _id: fileID });
    return file;
  }

  async fetchPagedFilesByParentID(parentId, page) {
    const pipeline = [
      { $match: { parentId } },
      { $skip: page },
      { $limit: 20 },
    ];
    const files = await this.filesCollection.aggregate(pipeline).toArray();
    return files;
  }

  async updateFile(filter, update) {
    const response = await this.filesCollection.updateOne(filter, update);
    return response;
  }
}

const dbClient = new DBClient();

export default dbClient;
