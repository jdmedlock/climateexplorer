
// GraphQL Query Functions
const countries = async (_, __, { dataSources }) => {
  return await dataSources.country.extractCountriesFromGhcnd();
};

// GraphQL Mutation Functions
const loadCountries = async (_, __, { dataSources }) => {
  const countries = await dataSources.country.extractCountriesFromGhcnd();
  await dataSources.country.loadCountries(countries);
  return countries;
};

export { countries, loadCountries };