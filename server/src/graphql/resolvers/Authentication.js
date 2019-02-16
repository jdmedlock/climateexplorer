// -----
// GraphQL Mutation Functions
// -----

const login = async (_, { email }, { dataSources }) => {
  const user = await dataSources.user.findUserByEmail(email);
  if (user) {
    return Buffer.from(email).toString('base64');
  }
  return null;
};

const logoff = async (_, __, { dataSources }) => {
  return true;
};

export { login, logoff };