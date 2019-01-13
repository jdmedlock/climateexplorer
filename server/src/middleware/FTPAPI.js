import Client from 'node-ftp';


class FTPAPI {
  constructor(hostURL, hostPort, userName, userPassword) {
    this.hostURL = hostURL;
    this.port = hostPort;
    this.user = userName;
    this.password = userPassword;
    this.ftpClient = new Client();
  }

  connect() {
    this.ftpClient.connect( {
      host: this.hostURL,
      port: this.port,
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