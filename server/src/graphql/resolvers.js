module.exports = {
  Query: {
    me: async (_, __, { dataSources }) => {
      return dataSources.userAPI.findUserByEmail("joe@gmail.com");
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
  },
};
