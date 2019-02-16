import { login, logoff } from './resolvers/Authentication';
import { countries, loadCountries } from './resolvers/Country';
import { me, user } from './resolvers/User';

module.exports = {
  Query: {
    countries: countries,
    me: me,
    user: user,
  },
  Mutation: {
    login: login,
    logoff: logoff,
    loadCountries: loadCountries
  },
};
