// GraphQL Query Functions

/**
 * Retrieve the currently authenticated user from the database
 * @param {*} _
 * @param {*} __
 * @param {*} { dataSources }
 * @returns {object} containing the user attributes or null if no user
 * with a matching email address was found.
 */
const me = async (_, __, { dataSources }) => {
  const email = dataSources.user.context.user;
  return email ? dataSources.user.findUserByEmail(email) : { name: null, email: null };
};

/**
 * Retrieve a user from the database
 * @param {*} _
 * @param {string} { email } User email address
 * @param {object} { dataSources }
 * @returns {object} containing the user attributes or null if no user
 * with a matching email address was found.
 */
const user = async (_, { email }, { dataSources }) => {
  return await dataSources.user.findUserByEmail(email);
};

export { me, user };