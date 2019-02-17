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
    this.ftpClient = new FTPClient();
    return await this.ftpClient.connect( {
      host: this.host_url,
      port: this.host_port,
      user: this.user,
      password: this.password,
    });
  }

  async disconnect() {
    console.log('Attempting to disconnect from FTP host...');
    return await this.ftpClient.end();
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
    await this.connect();
    return await this.ftpClient.list(directoryName);
  }
 
  getFile(fileName) {
    return new Promise((resolve,reject) => {
      this.ftpClient.get(fileName)
      .then((stream) => {
        return new Promise(function (resolve, reject) {
          stream.once('close', resolve);
          stream.once('error', reject);
          resolve(stream);
        });
      })
      .then((stream) => {
        resolve(stream);
      });
    });
  }
}

export default FTPAPI;