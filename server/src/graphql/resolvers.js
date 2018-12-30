module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.user,
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = dataSources.userAPI.findUserByEmail(email);
      return user;
    },
  },
};
