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
    let countries = null;
    const ftpSession = this.context.dataSources.ftpSession;
    ftpSession.connect()
    .then(() => {
      return ftpSession.getFile(`${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_COUNTIES_FILE}`);
    })  
    .then(stream => {
      console.log("File contents: ");
      countries = stream.read();
      console.log('countries: ', countries);
      ftpSession.disconnect();
    });
    process.env.NODE_ENV === 'production' ? null : console.log('extractCountriesFromGhcnd - counties: ', countries);
    return countries;
  }

}

module.exports = Country;
