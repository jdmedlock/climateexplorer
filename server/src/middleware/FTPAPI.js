import Client from 'node-ftp';


class FTPAPI {
  constructor(connectionOptions) {
    this.host_url = connectionOptions.host_url;
    this.host_port = connectionOptions.host_port;
    this.user = connectionOptions.userName;
    this.password = connectionOptions.userPassword;
    this.ftpClient = new Client();
  }

  connect() {
    this.ftpClient.connect( {
      host: this.host_url,
      port: this.host_port,
      user: this.user,
      password: this.password,
    });
  }

  disconnect() {
    this.ftpClient.end();
  }

  getDirectory(directoryName) {
    // Retrieve the directory list if the client is available
    this.connect();
    this.ftpClient.on('ready', () => {
      this.ftpClient.list(directoryName, (err, list) => {
        if (err) {
          throw err;
        }
        console.dir(list);
        this.disconnect();
      });
    });
  }

  getFile(fileName) {
    this.connect();
    this.ftpClient.on('ready', () => {
      this.ftpClient.get(fileName, (err, stream) => {
        if (err) {
          throw err;
        }
        stream.once('close', () => { 
          this.disconnect();
        });
        stream.pipe(process.stdout);
      });
    });
  }

}

export default FTPAPI;