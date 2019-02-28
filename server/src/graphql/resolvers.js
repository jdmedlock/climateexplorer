import { login, logoff } from './resolvers/Authentication';
import { extract } from './resolvers/Extract';
import { countries, loadCountries } from './resolvers/Country';
import { me, user } from './resolvers/User';

module.exports = {
  Query: {
    countries: countries,
    me: me,
    user: user,
  },
  Mutation: {
    extract: extract,
    login: login,
    logoff: logoff,
    loadCountries: loadCountries
  },
};
