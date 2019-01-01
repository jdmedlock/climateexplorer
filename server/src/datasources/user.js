import { DataSource } from 'apollo-datasource';
import isEmail from 'isemail';

class User extends DataSource {
  constructor(mongo) {
    super();
    this.users = [
      {
        id: '1',
        name: 'Joe User',
        email: 'joe@gmail.com'
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@gmail.com'
      }
    ];
    this.mongo = mongo;
    this.context = null;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findUserByEmail(emailArg) {
    const email = this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) {
      return null;
    }

    const user = await this.mongo.findOne('users', email);
    console.log('findUserByEmail - user: ', user);
    return user;
  }

}

module.exports = User;
