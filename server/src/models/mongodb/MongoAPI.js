import { DataSource } from 'apollo-datasource';
import { MongoClient } from 'mongodb';

class MongoAPI {
  constructor() {
    this.client = null;
    this.db = null;
    this.connect();
  }

  async connect() {
    // Return immediately if a connection has already been established.
    if (this.client) {
      return;
    }

    const url = 'mongodb://localhost:27017/etl';
    const dbName = 'etl';
    this.client = new MongoClient(url, { useNewUrlParser: true });

    try {
      await this.client.connect();
      this.db = await this.client.db(dbName);
      console.log('Connected to Mongodb!!! Excelsior!');
    } catch (err) {
      console.log(err.stack);
      throw new Error('Unable to connect to MongoDB');
    }
  };

  async disconnect() {
    await this.client.close();
  }

  async findOne(collectionName, query) {
    this.connect();
    const user = await this.db.collection(collectionName).findOne(query);
    return user;
  }

}

export default MongoAPI;