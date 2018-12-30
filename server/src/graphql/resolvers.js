module.exports = {
  Query: {
    me: async (_, __, { dataSources }) => 
     dataSources.userAPI.findUserByEmail("joe@gmail.com")
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = dataSources.userAPI.findUserByEmail(email);
      if (user) {
        return new Buffer(email).toString('base64');
      }
    },
  },
};
