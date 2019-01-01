import { DataSource } from 'apollo-datasource';
import { MongoClient } from 'mongodb';

class MongoAPI {
  constructor() {
    this.client = null;
    this.db = null;
    this.connect();
  }

  async connect() {
    const url = 'mongodb://localhost:27017/etl';
    const dbName = 'etl';
    this.client = new MongoClient(url);

    try {
      await this.client.connect();
      this.db = await this.client.db(dbName);
      console.log('Connected to Mongodb!!! Excelsior!');
    } catch (err) {
      console.log(err.stack);
    }

  };

  async disconnect() {
    await this.client.close();
  }

  async findOne(collectionName, userEmail) {
    const user = await this.db.collection(collectionName).findOne({ email: userEmail });
    return user;
  }

}

export default MongoAPI;