module.exports = {
  Query: {
    me: async (_, __, { dataSources }) => {
      return dataSources.userAPI.findUserByEmail("joe@gmail.com");
    },

    locations: async(_, __, { dataSources }) => {
      return dataSources.locationAPI.findLocations();
    },

    user: async (_, { email }, { dataSources }) => {
      return dataSources.userAPI.findUserByEmail(email);
    },
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = dataSources.userAPI.findUserByEmail(email);
      if (user) {
        return Buffer.from(email).toString('base64');
      }
    },
    logoff: async (_, __, { dataSources }) => {
      return null;
    },
  },
};
