import FTPClient from 'promise-ftp';

class FTPAPI {

  constructor(connectionOptions) {
    this.host_url = connectionOptions.host_url;
    this.host_port = connectionOptions.host_port;
    this.user = connectionOptions.user;
    this.password = connectionOptions.password;
    this.ftpClient = null;
  }

  async connect() {
    console.log('Attempting to connect to FTP host...');
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

  async disconnect() {
    console.log('Attempting to disconnect from FTP host...');
    return new Promise((resolve, reject) => {
      this.ftpClient.end()
      .then((result) => {
        console.log('...disconnect result: ', result);
        resolve(result);
      });
    });
  }

  /**
   * Retrieve a directory list from the FTP host
   * @param {string} directoryName Path to the directory
   * @returns {[dirlist]} Array of directory objects. For example, each entry
   * is formatted like:
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
    return new Promise((resolve, reject) => {
      this.connect()
      .then((result) => {
        console.log('Getting directory list...');
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
    * @returns {object} Contents of the file
    * @memberof FTPAPI
    */
  async getFile(fileName) {
    console.log('getFile - fileName: ', fileName);
    return new Promise((resolve, reject) => {
      this.connect()
      .then((result) => {
        console.log('connect result before get. result: ', result);
        return this.ftpClient.get(fileName);
      })
      .then((stream) => {
        console.log('Stream returned');    
        return new Promise((resolve, reject) => {
          let fileContents = '';
          stream.on('readable', () => {
            let chunk;
            while (null !== (chunk = stream.read())) {
              fileContents += chunk;
            }
          });
          stream.on('end', () => {
            resolve(fileContents);
          })
        })
        .then((fileContents) => {
          resolve(fileContents);
          return this.disconnect();
        })
        .then((result) => {
          console.log('getFile - Successful');
        })
      });
    });
  }
}

export default FTPAPI;