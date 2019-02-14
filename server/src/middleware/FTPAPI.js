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
    console.log('Attempting to connect...');
    this.ftpClient = new FTPClient();
    return this.ftpClient.connect( {
      host: this.host_url,
      port: this.host_port,
      user: this.user,
      password: this.password,
    });
  }

  async disconnect() {
    console.log('Attempting to disconnect...');
    return await this.ftpClient.end();
  }

  getDirectory(directoryName) {
    let directoryList = null;
    return new Promise((resolve,reject) => {
      this.ftpClient.list(directoryName)
      .then((list) => {
        directoryList = list;
      })
      .then(() => {
        resolve(directoryList); 
      });
    });
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