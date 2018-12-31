# Climate Explorer - Explore Global Climatology Data
[Climate Explorer](https://jdmedlock.github.io/climateexplorer/)
<br/>

[![climateexplorer last commit](https://img.shields.io/github/last-commit/google/skia.svg)](https://github.com/jdmedlock/climateexplorer)
<br/>
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/jdmedlock/climateexplorer/)


![Screenshot](https://github.com/jdmedlock/climateexplorer/blob/development/docs/ce_screenshot.png)

## Table of Contents

* [Overview](#overview)
* [Application Architecture](#application-architecture)
* [FAQ](#frequently-asked-questions)
* [Change Log](#change-log)
* [Contributing](#contributing)
* [Authors](#authors)
* [License](#license)

## Overview

This project is based on the assumption that ingesting large amounts of data
into an application is best accomplished by using a staging area to quickly
capture, cleanse, and organize data before loading it into an operational 
database (like an SQL DBMS) for permanent storage. This stems from the impact 
of large amounts of information and the relationships between them have on 
performance and operational efficiency.

One solution is to develop an extraction, transformation, and load (ETL) 
process that adds the raw data to a staging area, like a MongoDB database, 
without regard to data quality or their relationships. Once in the staging 
area, data can be reviewed and cleansed before moving it to a permanent home 
such as a Postgres SQL database. This strategy can be implemented to encompass 
two distinct load processes — an initial one-time bulk load and a periodic 
load of new data.

You can learn more about this effort by reading the series of articles on
[Medium](https://medium.com):

- [How to ETL with MongoDB and Postgres (Part 1)](https://medium.com/chingu/how-to-etl-with-mongodb-and-postgres-part-1-ef8476f0b8b2)

### Starting & Building the App

This application consists of a React front end and an Apollo Server backend, 
both of which must be running in order to use the application. Start by opening
two terminal sessions, one to `climateexplorer/client` and the other to
`climateexplorer/server`.

To start the frontend application issue the command `npm start` from the
`client` directory. Similarly, issue the command `npm start` from the `server`
directory to start the backend.

## Application Architecture

The architecture of the Climate Explorer application is shown in the
following diagram.

![React Component Structure](https://github.com/jdmedlock/climateexplorer/blob/development/docs/ce_architecture.png)

## Frequently Asked Questions

TBD

## Change Log

For more information see [Change Log](https://github.com/jdmedlock/climateexplorer/blob/development/docs/CHANGELOG.md)

## Contributing

See [Contributing](https://github.com/jdmedlock/climateexplorer/blob/development/docs/CONTRIBUTING.md)
and our [Collaborator Guide](https://github.com/jdmedlock/climateexplorer/blob/development/docs/COLLABORATOR_GUIDE.md).

## Authors

Developers on this project can be found on the [Contributors](https://github.com/jdmedlock/climateexplorer/graphs/contributors) page of this repo.

## License

[MIT](https://tldrlegal.com/license/mit-license)

