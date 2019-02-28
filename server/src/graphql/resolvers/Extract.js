import MongoAPI from '../../middleware/MongoAPI';


// -----
// GraphQL Mutation Functions
// -----

/**
 * Sort the file name list in ascending sequence based on the modification date
 * so the oldest entries occur first.
 * @param {[Object]} directoryList Array of directory entry objects
 */
const sortDirectoryList = (directoryList) => {
  const A_LT_B = -1;
  const A_EQ_B = 0;
  const A_GT_B = 1;

  directoryList.sort((a, b) => {
    if ( a.date < b.date ) {
      return A_LT_B;
    }
    if ( a.date > b.date ) {
      return A_GT_B;
    }
    return A_EQ_B;
  });
}

/**
 * Read the most recent entry from the checkpoint that was started, but 
 * for which extraction wasn't completed. Restart from this point.
 * @param {object} mongo Mongo API instance
 * @returns {Object} Most recent checkpoint document
 */
const getMostRecentCheckpoint = async (mongo) => {
  let mongoResult;
  const mostRecentChkpt = await mongo.findMax(
    'Checkpoint',
    { modificationYear: -1, modificationMonth: -1, modificationDay: -1 },
    { etlState: "STARTED" }
  );
  return mostRecentChkpt;
}

/**
 * Start extracting the next available file of weather observations. Always
 * start with the last unfinished file, otherwise select the next available
 * file.
 * @param {object} mongo Mongo API instance
 * @param {[object]} directoryList 
 * @returns {Object} fileNameToGet, checkpointDate, mostRecentChkpt
 */
const getNextCheckpoint = async(mongo, directoryList) => {
  let fileNameToGet = '';
  let checkpointDate;
  const mostRecentChkpt = await getMostRecentCheckpoint(mongo);
  if (!mostRecentChkpt) {
    // Search the directory list for the oldest file that remains to be extracted.
    // This is the first file for which there's no matching checkpoint.
    for (const entry of directoryList) {
      const checkpointDocument = await mongo.findOne(
        'Checkpoint',
        { fileName: entry.name }
      );
      if (!checkpointDocument) {
        // If there are no checkpoints start with the oldest file
        checkpointDate = entry.date;
        fileNameToGet = entry.name;
        const checkpointDocument = {
          fileName: entry.name,
          modificationYear: checkpointDate.getFullYear(),
          modificationMonth: checkpointDate.getMonth(),
          modificationDay: checkpointDate.getDate(),
          etlState: "STARTED"
        };
        const mongoResult = await mongo.insertOne('Checkpoint', checkpointDocument);
        break;
      }
    }
  } else {
    fileNameToGet = mostRecentChkpt.fileName;
  }
  return { fileNameToGet, checkpointDate, mostRecentChkpt}
}

/**
 * Update the ETL state in the specified Checkpoint document.
 * @param {string} fileName File name identifying the checkpoint
 * @param {Date} date Date identifying the checkpoint
 * @param {string} newStatus New status to assign to the Checkpoint
 * @returns {Object} Mongo update result
 */
const updateCheckpointState = async (mongo, fileName, date, newStatus) => {
  const checkpointFilter = {
    fileName: fileName,
    modificationYear: date.getFullYear(),
    modificationMonth: date.getMonth(),
    modificationDay: date.getDate()
  }
  const mongoResult = await mongo.updateOne('Checkpoint', checkpointFilter, 
  { $set: { etlState : newStatus } });
  return mongoResult;
}

/**
 * Create an Observation document in the staging area
 * @param {object} mongo Mongo API instance
 * @param {object} fileContents Contents of the daily weather observation file
 * @returns {object} Daily weather observation document if successful, otherwise
 * an error is thrown
 */
const createObservation = async (mongo, fileContents) => {
  const observation = {
    country_code: fileContents.slice(0, 2),
    network_code: fileContents.slice(2, 3),
    station_id: fileContents.slice(3, 11),
    year: parseInt(fileContents.slice(11, 15)),
    month: parseInt(fileContents.slice(15, 17)),
    element_type: fileContents.slice(17, 21)
  };
  try {
    const mongoResult = await mongo.insertOne('Observation', observation);
    return observation;
  } 
  catch(error) {
    throw new Error(`Error inserting new Observation document. Error: ${error}`);
  }
}

/**
 * Create a DailyWeather document in the staging area for each day in the
 * observation record
 * @param {object} mongo Mongo API instance
 * @param {object} fileContents Contents of the daily weather observation file
 */
const createDailyObservations = async (mongo, fileContents) => {
  try {
    // Create a new DailyWeather document in MongoDB for each weather
    // observation retrieved from NOAA
    const observations = fileContents.slice(21, 269);
    const valueCols = {start: 0, lth: 5};
    const mflagCols = {start: 5, lth: 1};
    const qflagCols = {start: 6, lth: 1};
    const sflagCols = {start: 7, lth: 1};
    const totalFieldsLth = sflagCols.start + sflagCols.lth;

    const dailyObsStartCol = 21;
    for (let dayOfMonth = 0; dayOfMonth < 31; dayOfMonth += 1) {
      const valueStart = dailyObsStartCol + (dayOfMonth * totalFieldsLth);
      const mflagStart = valueStart + mflagCols.start;
      const qflagStart = valueStart + qflagCols.start;
      const sflagStart = valueStart + sflagCols.start;

      const dailyWeather = {
        country_code: fileContents.slice(0, 2),
        network_code: fileContents.slice(2, 3),
        station_id: fileContents.slice(3, 11),
        year: parseInt(fileContents.slice(11, 15)),
        month: parseInt(fileContents.slice(15, 17)),
        day: parseInt(dayOfMonth+1),
        element_type: fileContents.slice(17, 21),
        measurement_flag: fileContents.slice(mflagStart, mflagStart + mflagCols.lth),
        quality_flag: fileContents.slice(qflagStart, qflagStart + qflagCols.lth),
        source_flag: fileContents.slice(sflagStart, sflagStart + sflagCols.lth),
        measurement_value: parseInt(fileContents.slice(valueStart, valueStart + valueCols.lth))
      };
      const mongoResult = await mongo.insertOne('DailyWeather', dailyWeather);
    }
  }
  catch(error) {
    throw new Error(`Error inserting new DailyWeather document. Error: ${error}`);
  }
}

/**
 * Extract weather observations from the NOAA site
 * @param {*} _ data
 * @param {*} __ args
 * @param {*} { dataSources }
 * @param {*} info
 * @returns {Boolean} `true` if successful, otherwise `false`
 */
const extract = async (_, __, { dataSources }, info) => {
  console.log('Extract starting!!!');
  const mongo = new MongoAPI();

  // Retrieve the list of observation file names and sort in ascending order 
  // by file date
  let directoryList;
  try {
    await dataSources.ftpSession.connect();
    directoryList = await dataSources.ftpSession.getDirectory(
      `${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_DAILY_DIR}`);
    sortDirectoryList(directoryList);
    await dataSources.ftpSession.disconnect();
  }
  catch(error) {
    console.log('extract - Direcory retrieval error: ', error);
    return false;
  }

  // Create the new checkpoint, retrieve the file using FTP, and add it to 
  // the staging database.
  try {
    await dataSources.ftpSession.connect();
    for (let i = 0; i < process.env.EXTRACT_FILES_PER_PASS; i += 1) {
      const {fileNameToGet, checkpointDate, mostRecentChkpt} = await getNextCheckpoint(mongo, directoryList);
      const fileContents = await dataSources.ftpSession.getFile(
        `${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_DAILY_DIR}/${fileNameToGet}`);
      const observation = await createObservation(mongo, fileContents);
      await createDailyObservations(mongo, fileContents);

      // If successfully added to the staging database, update its checkpoint
      // with the extract complete flag enabled
      const mongoResult = await updateCheckpointState(mongo, fileNameToGet, checkpointDate, "EXTRACTED");
    }
    await dataSources.ftpSession.disconnect();
    await mongo.disconnect();
  }
  catch(error) {
    console.log('extract - File retrieval error: ', error);
    return false;
  }
  
  return true;
};

export { extract };