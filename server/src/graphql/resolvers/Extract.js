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

  // Read the most recent entry from the checkpoint.
  

  // Search the list of file names retrieved above and locate the oldest file 
  // that remains to be extracted. Create a new checkpoint if not already present.

  // Retrieve the file using FTP, and add it to the staging database.

  // If successfully added to the staging database add a checkpoint for it
  // with the extract complete flag enabled

  return true;
};

export { extract };