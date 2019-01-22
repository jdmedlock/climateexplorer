import { DataSource } from 'apollo-datasource';

class Country extends DataSource {
  /**
   * Creates an instance of User
   * @memberof Location
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
   * @memberof Location
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * Extract countries from the Global Historical Climatology Network . 
   * @returns {Object[]} Object containing coun
   * @memberof Location
   */
  async extractCountriesFromGhcnd() {
    const ftpSession = this.context.dataSources.ftpSession;
    return new Promise(function (resolve, reject) {
      ftpSession.connect()
      .then(() => {
        return ftpSession.getFile(
          `${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_COUNTIES_FILE}`
        );
      })  
      .then(stream => {
        let countries = '';
        stream.on('readable', function() {
          let data;
          while (data = this.read()) {
            countries += data.toString();
          }
          resolve(countries);
          ftpSession.disconnect();
        });
      });
    })
    .then( (countries) => {
      const countriesObject = this.convertToObject(countries);
      // process.env.NODE_ENV === 'production' ? null : console.log('extractCountriesFromGhcnd - countries: ', countriesJSON);
      return countriesObject;
    });
  }

  // Convert a country entries from the format `code name` to an object
  // of the format `{code: '...', name: '...'}`
  convertToObject(countries) {
    const countriesArray = countries.split('\n').map((currentEntry => {
      const firstSpace = currentEntry.indexOf(' ');
      const countryCode = currentEntry.slice(0, firstSpace);
      const countryName = currentEntry.slice(firstSpace+1);
      return { code: countryCode, name: countryName };
    }));
    return countriesArray;
  }

  async loadCountries(countries) {
    const deleteResult = await this.mongoAPI.deleteAll('countries');
    console.log('Country - loadCountries - deleteResult: ', deleteResult);
    for (let countryData of countries) {
      const insertResult = await this.mongoAPI.insertOne('countries', countryData);
      console.log('loadCountries - result: ', insertResult);
    }
  }
}

module.exports = Country;
