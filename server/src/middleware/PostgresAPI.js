import { DataSource } from 'apollo-datasource';

class PostgresAPI {
  constructor() {
    this.pg = require('pg');
    this.pool = null;
    this.connect();
  }

  /**
   * Create a connection to the Postgres instance.
   * @memberof PostgresAPI
   */
  async connect() {
    // Return immediately if a connection has already been established.
    if (this.client) {
      return;
    }

    try {
      this.pool = new this.pg.Pool({
        user: process.env.PG_CONNECTION_USER,
        host: process.env.PG_CONNECTION_HOSTADDR,
        database: process.env.PG_CONNECTION_DBNAME,
        password: process.env.PG_CONNECTION_PASSWORD,
        port: process.env.PG_CONNECTION_PORT
      });
      console.log(`Connected to Postgres! - ${process.env.PG_CONNECTION_HOSTADDR}:${process.env.PG_CONNECTION_PORT}`);
    } catch (err) {
      console.log(err.stack);
      throw new Error('Unable to connect to Postgres');
    }
  };

  /**
   * Retrieve an entire table from the database.
   * @param {*} tableName
   * @returns Matching rows or null if none found.
   * @memberof PostgresAPI
   */
  async selectAll(tableName) {
    this.connect();
    pool.query("SELECT * FROM etl_test.locations", (err, res) => {
      pool.end();
    });
    return res.rows;
  }

}

export default PostgresAPI;