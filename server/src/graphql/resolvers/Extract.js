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

  const fileNameToGet = '';
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
        }
        const insertResult = await mongo.insertOne('Checkpoint', checkpointDocument);
        console.log('Checkpoint insert result: ', insertResult);
        fileNameToGet = entry.name;
        break;
      }
    }
  }

  // Retrieve the file using FTP, and add it to the staging database.
  const fileContents = await dataSources.ftpSession.getFile(fileNameToGet);
  console.log('file contents: ', fileContents);

  // If successfully added to the staging database update its checkpoint
  // with the extract complete flag enabled

  await mongo.disconnect();

  return true;
};

export { extract };