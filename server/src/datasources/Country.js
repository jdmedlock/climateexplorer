import { DataSource } from 'apollo-datasource';

class Country extends DataSource {
  /**
   * Creates an instance of User
   * @memberof Country
   */
  constructor(mongoAPI) {
    super();
    this.mongoAPI = mongoAPI;
    this.context = null;
  }

  /**
   * `initialize` is called by ApolloServer as part of its setup process. We'll 
   * assign the request context to this object, so we can know about the user
   * making requests.
   * @param {*} config DataSource configuration including things like caches
   * and context
   * @memberof Country
   */
  initialize(config) {
    this.context = config.context;
  }

  async getCountries(stream) {
    let countries = '';
    return new Promise(async (resolve, reject) => {
      stream.on('readable', () => {
        let data;
        while (data = stream.read()) {
          countries += data.toString();
        }
        resolve(countries);
      })
    })
    .then( countries => countries );
  }

  /**
   * Convert an array of country entries from strings to objects.
   * @param {[String]} Array of countries. Entries are strings consisting of a
   * space separated country code and name.
   * @returns Array of country objects in the format `{code: country-code, name: country-name}`
   * @memberof Country
   */
  convertToObject(countries) {
    const countriesArray = countries.split('\n').map((currentEntry => {
      const firstSpace = currentEntry.indexOf(' ');
      const countryCode = currentEntry.slice(0, firstSpace);
      const countryName = currentEntry.slice(firstSpace+1);
      return { code: countryCode, name: countryName };
    }));
    return countriesArray;
  }

  /**
   * Extract countries from the Global Historical Climatology Network . 
   * @returns {[Object]} Array of objects containing country codes and names
   * @memberof Country
   */
  async extractCountriesFromGhcnd() {
    const ftpSession = this.context.dataSources.ftpSession;
    await ftpSession.connect();
    const stream = await ftpSession.getFile(
        `${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_COUNTIES_FILE}`
    );
    const countries = await this.getCountries(stream);
    const countriesObject = this.convertToObject(countries);
    return countriesObject;
  }

  /**
   * Replace the current country collection with new country documents. 
   * @param {[Object]} Array of objects containing the country codes and names.
   * @memberof Country
   */
  async loadCountries(countries) {
    const deleteResult = await this.mongoAPI.deleteAll('countries');
    if (deleteResult && deleteResult.status === 'successful') {
      for (let countryData of countries) {
        const insertResult = await this.mongoAPI.insertOne('countries', countryData);
        if (insertResult && insertResult.status !== 'successful') {
          throw new Error('Unsuccessful insert of countries documents. insertResult: ', insertResult);
        }
      }
    } else {
      throw new Error('Unsuccessful delete of countries documents. deleteResult: ', deleteResult);
    }
  }
}

module.exports = Country;
