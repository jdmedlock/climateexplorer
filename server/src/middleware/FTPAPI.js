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
    const directoryList = await this.ftpClient.list(directoryName);
    await this.disconnect();
    return directoryList;
  }

  /**
    * Retrieve a file from the FTP host
    * @param {string} fileName
    * @returns {object} Contents of the file
    * @memberof FTPAPI
    */
  async getFile(fileName) {
    let fileContents = '';
    await this.connect()
    const stream = await this.ftpClient.get(fileName);
    console.log('Stream returned: ');
    return new Promise( (resolve, reject) => {
      stream.on('readable', async () => {
        let chunk;
        while (null !== (chunk = stream.read())) {
          fileContents += chunk;
        }
      });
      stream.on('end', async () => {
        await this.disconnect();
        resolve(fileContents);
      });
    });
  }
}

export default FTPAPI;