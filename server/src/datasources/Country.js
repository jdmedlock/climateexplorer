import { DataSource } from 'apollo-datasource';

class Country extends DataSource {
  /**
   * Creates an instance of User
   * @memberof Location
   */
  constructor() {
    super();
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
        return ftpSession.getFile(`${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_COUNTIES_FILE}`);
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
      const countriesJSON = this.convertStringToJSON(countries);
      process.env.NODE_ENV === 'production' ? null : console.log('extractCountriesFromGhcnd - countries: ', countriesJSON);
      return countriesJSON.toString();
    });
  }

  convertStringToJSON(countries) {
    const countriesArray = countries.split('\n').map((currentEntry => {
      const firstSpace = currentEntry.indexOf(' ');
      const countryCode = currentEntry.slice(0, firstSpace);
      const countryName = currentEntry.slice(firstSpace+1);
      return { code: countryCode, name: countryName };
    }));
    return JSON.parse(JSON.stringify(countriesArray));
  }

}

module.exports = Country;
