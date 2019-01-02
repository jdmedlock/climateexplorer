import { DataSource } from 'apollo-datasource';
import isEmail from 'isemail';

class User extends DataSource {
  /**
   * Creates an instance of User
   * @param {*} mongoAPI Object containing Mongo access functions 
   * @memberof User
   */
  constructor(mongoAPI) {
    super();
    this.mongoAPI = mongoAPI;
    this.context = null;
  }

  /**
   * `initialize` is called by ApolloServer as part of its setup process. We'll 
   * assign the request context to this object, so we can know about the user
   * making requests.
   * @param {*} config DataSource configuration including things like caches
   * and context
   * @memberof User
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * Retrieve a single user based on the email address that is provided when
   * invoked. If the user is already on the context, that users email address
   * will be used instead of `emailArg`.
   * @param {*} emailArg Email address of the user
   * @returns User object retrieved from the database
   * @memberof User
   */
  async findUserByEmail(emailArg) {
    const email = this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) {
      return null;
    }

    const user = await this.mongoAPI.findOne('users', { email: email });
    process.env.NODE_ENV === 'production' ? null : console.log('findUserByEmail - user: ', user);
    return user;
  }

}

module.exports = User;
