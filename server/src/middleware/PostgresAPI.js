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
    if (this.pool) {
      return;
    }

    try {
      this.pool = new this.pg.Pool({
        user: process.env.PG_CONNECTION_USER,
        password: process.env.PG_CONNECTION_PASSWORD,
        host: process.env.PG_CONNECTION_HOSTADDR,
        database: process.env.PG_CONNECTION_DBNAME,
        port: process.env.PG_CONNECTION_PORT,
      });
      console.log(`Connected to Postgres! - ${process.env.PG_CONNECTION_HOSTADDR}:${process.env.PG_CONNECTION_PORT}`);
    } catch (err) {
      console.log(err.stack);
      throw new Error('Unable to connect to Postgres');
    }
  };

  /**
   * Release the connection pool
   * @memberof PostgresAPI
   */
  async disconnect() {
    if (!this.pool) {
      return;
    }
    await this.pool.end();

  }

  /**
   * Retrieve rows from a table based on a set of WHERE-clause predicates.
   * @param {string} schemaName Schema name
   * @param {string} tableName Table name
   * @param {string} predicates Where-clause predicatees
   * @returns Matching rows or null if none found.
   * @memberof PostgresAPI
   */
  async select(schemaName, tableName, predicates) {
    this.connect();
    const resultSet = await this.pool.query(
      `SELECT * FROM ${schemaName}."${tableName}" WHERE ${predicates}`
    );
    return resultSet.rows;
  }

  /**
   * Retrieve an entire table from the database.
   * @param {string} schemaName Schema name
   * @param {string} tableName Table name
   * @returns Matching rows or null if none found.
   * @memberof PostgresAPI
   */
  async selectAll(schemaName, tableName) {
    this.connect();
    const resultSet = await this.pool.query(
      `SELECT * FROM ${schemaName}."${tableName}"`
    );
    return resultSet.rows;
  }

}

export default PostgresAPI;