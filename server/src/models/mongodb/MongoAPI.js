// const MongoClient = require('mongodb').MongoClient;
import { MongoClient } from 'mongodb';


class MongoAPI {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    const url = 'mongodb://localhost:27017/etl';
    const dbName = 'etl';
    this.client = await new MongoClient(url);

    try {
      // Use connect method to connect to the Server
      console.log('Attempting to connect to Mongodb...')
      await this.client.connect();
      this.db = await this.client.db(dbName);
      console.log('Connected to Mongodb!!! Excelsior! db:', this.db);
    } catch (err) {
      console.log(err.stack);
    }

  };

  async disconnect() {
    await this.client.close();
  }

  async find(collectionName) {
    const cursor = await this.db.collection(collectionName).find({});
    cursor.each((error, user) => {
      if (user === null) {
        console.log('Find all users successfully completed');
        return;
      }
      console.log('user: ', user);
    });
  }

}

export default MongoAPI;