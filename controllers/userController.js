const { User } = require('../models/relations');

var admin = require('firebase-admin');
const logger = require('../logging/logger');

var serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pipo-api-oauth-default-rtdb.firebaseio.com'
});

class UserController {
  static async createUser (idToken) {
    try {
      const adminInstance = await admin.auth();
      const userInfo = await adminInstance.verifyIdToken(idToken);
      const name = userInfo.name;
      const email = userInfo.email;

      const user = await User.findOne({ where: { email: email } });

      if (user) {
        return {
          isError: true,
          message: 'This email already exists',
          status: 409,
          isLoggedIn: true,
          user
        };
      }
      console.log(user);
      const auth = {
        email,
        name
      };
      const createdUser = await User.create(auth);
      console.log(createdUser);
      return {
        message: 'User created',
        userInfo,
        createdUser,
        status: 200
      };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString(),
        status: 400
      };
    }
  }

  static async createUserSignup (auth) {
    try {
      const user = await User.findOne({ where: { email: auth.email } });
      if (user) {
        return {
          isError: true,
          message: 'This email already exists',
          status: 409
        };
      }
      const createdAuth = await User.create(auth, {
        attributes: { exclude: ['password'] }
      });
      createdAuth.password = null;
      return {
        message: 'Auth created',
        createdAuth,
        status: 200
      };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString(),
        status: 400
      };
    }
  }

  static async getAuthByEmail (auth) {
    try {
      const user = await User.findOne({ where: { email: auth.email, isAdmin: auth.isAdmin } });
      console.log(user);
      user.password = '';
      if (!user) {
        return {
          message: "User doesn't exist",
          isError: true
        };
      }
      return user;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }
}

module.exports = UserController;
