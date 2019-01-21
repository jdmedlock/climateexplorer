import { DataSource } from 'apollo-datasource';
import { MongoClient } from 'mongodb';

class MongoAPI {
  constructor() {
    this.client = null;
    this.db = null;
    this.connect();
  }

  /**
   * Create a connection to the MongoDB instance.
   * It is worth noting that no connection pooling is implemented at this time.
   * For performance, it may be necessary in the future to expand on this to
   * create a pool of connections to support asynchronous database access.
   * @memberof MongoAPI
   */
  async connect() {
    // Return immediately if a connection has already been established.
    if (this.client) {
      return;
    }

    const url = process.env.MONGODB_URL;
    const dbName = process.env.MONGODB_CE_DBNAME;
    this.client = new MongoClient(url, { useNewUrlParser: true });

    try {
      await this.client.connect();
      this.db = await this.client.db(dbName);
      console.log(`Connected to Mongodb! - ${process.env.MONGODB_URL}`);
    } catch (err) {
      console.log(err.stack);
      throw new Error('Unable to connect to MongoDB');
    }
  };

  /**
   * Release the current database connection
   * @memberof MongoAPI
   */
  async disconnect() {
    if (!this.client) {
      return;
    }
    await this.client.close();
  }

  /**
   * Retrieve a single document from the database.
   * @param {*} collectionName
   * @param {*} query
   * @returns Matching document or null if none found.
   * @memberof MongoAPI
   */
  async findOne(collectionName, query) {
    this.connect();
    const document = await this.db.collection(collectionName).findOne(query);
    return document;
  }

  async insertOne(collectionName, data) {
    this.connect();
    const result = await this.db.collection(collectionName).insertOne(data);
    console.log('insertOne result: ', result);
    return result;
  }

}

export default MongoAPI;