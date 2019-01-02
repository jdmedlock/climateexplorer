# Application Notes

## Installing MongoDB on MacOS

1. brew install mongodb
2. sudo mkdir -p /data/db
3. sudo chown -R `id -un` /data/db

To start the first time enter the command `mongod --config /usr/local/etc/mongod.conf`.
To create a service that automatically starts it at login time 
`brew services start mongodb`, otherwise, just use `mongodb`

Note that monitoring and manual inspection of data is being performed using
MongoDB Compass.