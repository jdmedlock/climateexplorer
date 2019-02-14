// GraphQL Query Functions

const me = async (_, __, { dataSources }) => {
  return dataSources.user.findUserByEmail("joe@gmail.com");
};

const user = async (_, { email }, { dataSources }) => {
  return await dataSources.user.findUserByEmail(email);
};

export { me, user };