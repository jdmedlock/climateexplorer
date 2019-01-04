module.exports = {
  Query: {
    me: async (_, __, { dataSources }) => {
      return dataSources.userAPI.findUserByEmail("joe@gmail.com");
    },

    locations: async(_, __, { dataSources }) => {
      return await dataSources.locationAPI.findLocations();
    },

    user: async (_, { email }, { dataSources }) => {
      return await dataSources.userAPI.findUserByEmail(email);
    },
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findUserByEmail(email);
      if (user) {
        return Buffer.from(email).toString('base64');
      }
      return null;
    },
    logoff: async (_, __, { dataSources }) => {
      return null;
    },
  },
};
