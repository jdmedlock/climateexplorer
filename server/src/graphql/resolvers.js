module.exports = {
  Query: {
    countries: async (_, __, { dataSources }) => {
      return await dataSources.country.extractCountriesFromGhcnd();
    },

    me: async (_, __, { dataSources }) => {
      return dataSources.user.findUserByEmail("joe@gmail.com");
    },

    locations: async(_, __, { dataSources }) => {
      return await dataSources.location.findLocations();
    },

    user: async (_, { email }, { dataSources }) => {
      return await dataSources.user.findUserByEmail(email);
    },
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.user.findUserByEmail(email);
      if (user) {
        return Buffer.from(email).toString('base64');
      }
      return null;
    },
    logoff: async (_, __, { dataSources }) => {
      return true;
    },
    loadCountries: async (_, __, { dataSources }) => {
      const countries = await dataSources.country.extractCountriesFromGhcnd();
      await dataSources.country.loadCountries(countries);
      return countries;
    }
  },
};
