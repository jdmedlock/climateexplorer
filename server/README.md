# Climate Explorer - Explore Global Climatology Data
[Climate Explorer](https://jdmedlock.github.io/climateexplorer/)
<br/>

[![climateexplorer last commit](https://img.shields.io/github/last-commit/google/skia.svg)](https://github.com/jdmedlock/climateexplorer)
<br/>
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/jdmedlock/climateexplorer/)


![Screenshot](https://github.com/jdmedlock/climateexplorer/blob/development/docs/ce_screenshot.png)

## Table of Contents

* [Overview](#overview)
* [API](#api)
* [Dependencies](#dependencies)
* [Server Architecture](#serve-architecture)

## Overview

The Climate Explorer application backend utilizes Apollo GraphQL to provide 
access to data and services required by the frontend application.

## API

The API is based on Apollo GraphQL and makes the following queries and
mutations available to the frontend application.

| Type     | Name        | Description     |
|:---------|:------------|:----------------|
| Query    | user(email) | Retrieves a specific user given an email address |
| Mutation | login(email) | Retrieves a login token for the user with the specified email address |


### Starting & Building the App

To start the application in development mode simply run `npm run start`from
the command line. The application will automatically open a new tab in your
browser with the url `localhost:4000`.

To start the application in production mode run `npm run serve`
from the command line. In production mode the app will automatically create a
new browser tab with the url `localhost:5000`. The main difference between
production and development modes is a Service Worker runs in productin mode to
support offline execution.

The production version of the app on GitHub Pages is built by running `npm run publish`.

#### MongoDB

Climate Explorer uses MongoDB as an intermediate staging area for the ingestion
and cleansing of data prior to adding it to ta Postgres database. Due to this
dependency this application requires a running instance of a MongoDB database.
For example, on MacOS MongoDB is started by opening a new terminal window and
entering the command `mongodb`.

The steps required to install MongoDB can be found [here](https://docs.mongodb.com/manual/installation/).

#### Postgres

<TBD - document how to start Postgres instance>

### Environment Variables

Environment variables that control the operation of the app are defined in the
`.env` file in the application root. These variables and their usage are shown
in the following table. It's important to keep in mind that when these settings
in the `.env` file are changed `npm run build` must be run before they will
take effect.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`. For example, the
homepage for the NOAA site is accessed in the code by referencing
`process.env.NOAA_HOMEPAGE`.

Remember that even though this keeps secure tokens like client id's and secrets
out of application code it does not make them secure.

| Environment Variable    | Description | Example Setting |
|:------------------------|:------------|:----------------|
| TBD                     | TBD         | TBD             |

## Dependencies

### Libraries

This app has the following dependencies

| Module/Library | Environment | Description | Related Files |
|:---------------|:------------|:------------|:--------------|
| apollo         | Developmenbt | Apollo CLI  | N/a |
| apollo-datasource | Runtime  | - | N/a |
| apollo-link    | Runtime     | GraphQL Transport Layer | N/a |
| apollo-link-http | Runtime   | GraphQL HTTP Transport | N/a |
| apollo-server  | Runtime     | GraphQL Server | N/a |
| babel-plugin-transform-object-rest-spread | Development | Babel plugin | `.babelrc` |
| babel-preset-env | Development | Babel ES6 presets | `.babelrc` |
| dotenv         | Runtime     | Environment variables | `.env` |
| graphql        | Runtime     | GraphQL Reference implementation | N/a |
| isemail        | Runtime     | Email address validator | N/a |
| mongodb        | Runtime     | MongoDB Driver | N/a |
| nodemon        | Development | NodeJS Monitor | `package.json` scripts |

### External Dependencies

The MongoDB and Postgres databases files required by Climate Explorer are
stored in a file system outside the project directory. In the case of MongoDB
the database files are maintained in `/data/db`.

<TBD - document location of Postgres database files>

## Server Architecture

The architecture of the server is shown in the following diagram.

![React Component Structure](https://github.com/jdmedlock/climateexplorer/blob/development/docs/ce_server_architecture.png)
