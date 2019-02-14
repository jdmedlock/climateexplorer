// GraphQL Query Functions

const locations = async(_, __, { dataSources }) => {
  return await dataSources.location.findLocations();
};

export { locations };