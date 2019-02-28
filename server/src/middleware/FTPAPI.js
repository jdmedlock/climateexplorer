import FTPClient from 'promise-ftp';

class FTPAPI {

  constructor(connectionOptions) {
    this.host_url = connectionOptions.host_url;
    this.host_port = connectionOptions.host_port;
    this.user = connectionOptions.user;
    this.password = connectionOptions.password;
    this.ftpClient = null;
  }

  /**
   * Establish a connection to the FTP server
   * @returns {Promise} Resolves to the greeting message from the FTP server
   * @memberof FTPAPI
   */
  async connect() {
    console.log('Attempting to connect to FTP host...');
    // Return a promise to allow async/await to function as expected since
    // functions in the `promise-ftp` package return Bluebird promises
    return new Promise((resolve, reject) => {
      this.ftpClient = new FTPClient();
      this.ftpClient.connect( {
        host: this.host_url,
        port: this.host_port,
        user: this.user,
        password: this.password,
      })
      .then((result) => {
        console.log('...connect result: ', result);
        resolve(result);
      });
    });
  }

  /**
   * Terminate the connection to the FTP server
   * @returns {Promise} Resolves to `false` if successful. If unsuccessful, 
   * resolves to the error message or `true` if the error message wasn't
   * captured.
   * @memberof FTPAPI
   */
  async disconnect() {
    console.log('Attempting to disconnect from FTP host...');
    // Return a promise to allow async/await to function as expected since
    // functions in the `promise-ftp` package return Bluebird promises
    return new Promise((resolve, reject) => {
      this.ftpClient.end()
      .then((result) => {
        console.log('...disconnect result: ', result);
        resolve(result);
      });
    });
  }

  /**
   * Change the working directory on FTP server. Note that an active FTP
   * session must be created before invoking this function.
   * @param {string} Path Fully qualified path to change to
   * @returns {Promise} Resolves to the new current directory, if the server 
   * replies with it in the response text; otherwise resolves to undefined.
   * @memberof FTPAPI
   */
  async cd(path) {
    console.log('Attempting to change directory on FTP host...');
    // Return a promise to allow async/await to function as expected since
    // functions in the `promise-ftp` package return Bluebird promises
    return new Promise((resolve, reject) => {
      this.ftpClient.cwd(path)
      .then((result) => {
        console.log('...cd result: ', result);
        resolve(result);
      });
    });
  }

  /**
   * Retrieve a directory list from the FTP host
   * @param {string} directoryName Path to the directory
   * @returns {Promise} Resolves to an array of directory objects. Entries are
   * formatted like:
   * @example
   *   { type: '-',
   *     name: 'AJ000037579.dly',
   *     target: undefined,
   *     sticky: false,
   *     rights: { user: 'rw', group: 'r', other: 'r' },
   *     acl: false,
   *     owner: 'ftp',
   *     group: '1005',
   *     size: 132030,
   *     date: 2012-11-29T00:00:00.000Z 
   *   },
   * @memberof FTPAPI
   */
  async getDirectory(directoryName) {
    let fileList;
    // Return a promise to allow async/await to function as expected since
    // functions in the `promise-ftp` package return Bluebird promises
    return new Promise((resolve, reject) => {
      this.connect()
      .then((result) => {
        return this.ftpClient.list(directoryName);
      })
      .then((directoryList) => {
        fileList = directoryList;
        return this.disconnect();
      })
      .then((result) => {
        resolve(fileList);
      });
    });
  }

  /**
    * Retrieve a file from the FTP host
    * @param {string} fileName
    * @returns {Promise} Resolves to a string containing the file contents
    * @memberof FTPAPI
    */
  async getFile(fileName) {
    console.log('getFile - fileName: ', fileName);
    // Return a promise to allow async/await to function as expected since
    // functions in the `promise-ftp` package return Bluebird promises
    return new Promise((resolve, reject) => {
      this.connect()
      .then((result) => {
        return this.ftpClient.get(fileName);
      })
      .then((stream) => {
        return new Promise((resolve, reject) => {
          stream.on('readable', () => {
            let allChunks = '';
            let chunk;
            while (null !== (chunk = stream.read())) {
              allChunks += chunk;
            }
            resolve(allChunks);
          });
        })
        .then((fileContents) => {
          resolve(fileContents);
          return this.disconnect();
        })
        .then((result) => {
          console.log('getFile - Successful');
        });
      });
    });
  }
}

export default FTPAPI;