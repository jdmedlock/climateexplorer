module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.user,
  },
};
