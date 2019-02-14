import { login, logoff } from './resolvers/Authentication';
import { countries, loadCountries } from './resolvers/Country';
import { locations } from './resolvers/Location';
import { me, user } from './resolvers/User';

module.exports = {
  Query: {
    countries: countries,
    me: me,
    locations: locations,
    user: user,
  },
  Mutation: {
    login: login,
    logoff: logoff,
    loadCountries: loadCountries
  },
};
