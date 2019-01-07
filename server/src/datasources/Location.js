import { DataSource } from 'apollo-datasource';

class Location extends DataSource {
  /**
   * Creates an instance of User
   * @param {*} postgresAPI Object containing Mongo access functions 
   * @memberof Location
   */
  constructor(postgresAPI) {
    super();
    this.postgresAPI = postgresAPI;
    this.context = null;
  }

  /**
   * `initialize` is called by ApolloServer as part of its setup process. We'll 
   * assign the request context to this object, so we can know about the user
   * making requests.
   * @param {*} config DataSource configuration including things like caches
   * and context
   * @memberof Location
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * Retrieve all locations. 
   * @returns {Object[]} Location objects retrieved from the database
   * @memberof Location
   */
  async findLocations() {
    const locations = await this.postgresAPI.selectAll(process.env.PG_CONNECTION_SCHEMA, 'locations');
    process.env.NODE_ENV === 'production' ? null : console.log('findLocation - locations: ', locations);
    return locations;
  }

}

module.exports = Location;
