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
 * Delete all documents in a collection
 * @param {String} collectionName Collection name
 * @returns Result of the deletion
 * @memberof MongoAPI
 */
async deleteAll(collectionName) {
    this.connect();
    const result = await this.db.collection(collectionName).deleteMany({});
    const deleteResult = {
      status: result.result.ok === 1 ? 'successful' : 'failed',
      documentCount: result.deletedCount
    };
    return deleteResult;
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
/**
 * Insert a new document into a collection
 * @param {String} collectionName Collection name
 * @param {Object} document Document to be inserted
 * @returns Result of the insersion
 * @memberof MongoAPI
 */
async insertOne(collectionName, document) {
    this.connect();
    const result = await this.db.collection(collectionName).insertOne(document);
    const insertResult = {
      status: result.result.ok === 1 ? 'successful' : 'failed',
      documentCount: result.insertedCount,
      id: result.insertedId,
      code: result.ops[0].code,
      name: result.ops[0].name
    };
    return insertResult;
  }

}

export default MongoAPI;