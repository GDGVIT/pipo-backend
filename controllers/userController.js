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
}

module.exports = UserController;
