import MongoAPI from '../../middleware/MongoAPI';


// -----
// GraphQL Mutation Functions
// -----

const extract = async (_, __, { dataSources }) => {
  // Retrieve the list of observation file names along with the date they were
  // last modified
  const directoryList = await dataSources.ftpSession.getDirectory(
    `${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_DAILY_DIR}`);
  console.log('directoryList: ', directoryList[0]); // List the first entry
  console.log('...no. entries retrieved: ', directoryList.length);
  
  // Sort the file name list in ascending sequence based on the modification date
  // so the oldest entries occur first.
  directoryList.sort((a, b) => {
    const A_LT_B = -1;
    const A_EQ_B = 0;
    const A_GT_B = 1;
    if ( a.date < b.date ) {
      return A_LT_B;
    }
    if ( a.date > b.date ) {
      return A_GT_B;
    }
    return A_EQ_B;
  });
  console.log('directoryList after sorting: ', directoryList[0]); // List the first entry

  // Read the most recent entry from the checkpoint that was started, but 
  // for which extraction wasn't completed. Restart from this point.
  const mongo = new MongoAPI();
  const mostRecentChkpt = await mongo.findMax(
    'Checkpoint',
    { modificationYear: -1, modificationMonth: -1, modificationDay: -1 },
    { etlState: "STARTED" }
  );
  console.log('Most recent checkpoint - mostRecentChkpt: ', mostRecentChkpt);

  let fileNameToGet = '';
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
        const checkpointDate = entry.date;
        const checkpointDocument = {
          fileName: entry.name,
          modificationYear: checkpointDate.getFullYear(),
          modificationMonth: checkpointDate.getMonth(),
          modificationDay: checkpointDate.getDate(),
          etlState: "STARTED"
        };
        const insertResult = await mongo.insertOne('Checkpoint', checkpointDocument);
        console.log('Checkpoint insert result: ', insertResult);
        fileNameToGet = entry.name;
        break;
      }
    }
  } else {
    fileNameToGet = mostRecentChkpt.fileName;
  }

  // Retrieve the file using FTP, and add it to the staging database.
  const fileContents = await dataSources.ftpSession.getFile(
    `${process.env.NOAA_FTP_GHCN_DIRECTORY}/${process.env.NOAA_FTP_DAILY_DIR}/${fileNameToGet}`);
  console.log('file retrieved. length: ', fileContents.length);
  console.log('file contents: ', fileContents);

  const observation = {
    country_code: fileContents.slice(0, 2),
		network_code: fileContents.slice(2, 3),
		station_id: fileContents.slice(3, 11),
		year: fileContents.slice(11, 15),
		month: fileContents.slice(15, 17),
		element_type: fileContents.slice(17, 21)
  };
  console.log('observation: ', observation);

  const observations = fileContents.slice(21, 269);
  // Daily observation field ranges following `slice` bounds rules
  const valueCols = {start: 0, end: 5};
  const mflagCols = {start: 5, end: 6};
  const qflagCols = {start: 6, end: 7};
  const sflagCols = {start: 7, end: 8};

  const dailyObsStartCol = 21;
  for (let dayOfMonth = 0; dayOfMonth < 31; dayOfMonth += 1) {
    const dailyWeather = {
      country_code: fileContents.slice(0, 2),
      network_code: fileContents.slice(2, 3),
      station_id: fileContents.slice(3, 11),
      year: fileContents.slice(11, 15),
      month: fileContents.slice(15, 17),
      element_type: fileContents.slice(17, 21),
      measurement_flag: fileContents.slice(
        dailyObsStartCol + (dayOfMonth*mflagCols.start),
        dailyObsStartCol + (dayOfMonth*mglagCols.end) ),
      quality_flag: fileContents.slice(
        dailyObsStartCol + (dayOfMonth*qflagCols.start),
        dailyObsStartCol + (dayOfMonth*qflagCols.end) ),
      source_flag: fileContents.slice(
        dailyObsStartCol + (dayOfMonth*sflagCols.start),
        dailyObsStartCol + (dayOfMonth*sflagCols.end) ),
      measurement_value: fileContents.slice(
        dailyObsStartCol + (dayOfMonth*valueCols.start),
        dailyObsStartCol + (dayOfMonth*valueCols.end) )
    };
    console.log('dailyWeather: ', dailyWeather);
  }

  // If successfully added to the staging database update its checkpoint
  // with the extract complete flag enabled

  await mongo.disconnect();

  return true;
};

export { extract };