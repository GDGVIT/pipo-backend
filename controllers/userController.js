const { User } = require('../models/relations')

const admin = require('firebase-admin')
const logger = require('../logging/logger')

const serviceAccount = require('../firebase.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pipo-api-oauth-default-rtdb.europe-west1.firebasedatabase.app'
})

class UserController {
  static async createUser (idToken) {
    try {
      const adminInstance = await admin.auth()
      const userInfo = await adminInstance.verifyIdToken(idToken)
      const name = userInfo.name
      const email = userInfo.email
      const picture = userInfo.picture
      const user = await User.findOne({ where: { email: email } })

      if (user) {
        return {
          message: 'This email already exists',
          isLoggedIn: true,
          user,
          status: 200
        }
      }

      const auth = {
        email,
        name,
        picture,
        points: 20,
        isAdmin: false,
        userName: name
      }
      const createdUser = await User.create(auth)
      console.log(createdUser)
      return {
        message: 'User created',
        userInfo,
        createdUser,
        status: 201
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        status: 400
      }
    }
  }

  static async createUserSignup (auth) {
    try {
      const user = await User.findOne({ where: { email: auth.email } })
      if (user) {
        return {
          isError: true,
          message: 'This email already exists, please login',
          status: 409
        }
      }
      const createdAuth = await User.create(auth, {
        attributes: { exclude: ['password'] }
      })
      createdAuth.password = null
      return {
        message: 'Auth created',
        createdAuth,
        status: 200
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        status: 400
      }
    }
  }

  static async getUser (userId) {
    try {
      const user = await User.findByPk(userId)
      if (user) {
        return user
      }
      return { message: "User doesn't exist", isError: true }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        status: 400
      }
    }
  }

  static async getAuthByEmail (auth) {
    try {
      const user = await User.findOne({ where: { email: auth.email, isAdmin: auth.isAdmin } })
      console.log(user)
      user.password = ''
      if (!user) {
        return {
          message: "User doesn't exist",
          isError: true
        }
      }
      return user
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async update (user, userId) {
    try {
      const resp = await User.update(user, {
        where: {
          userId
        }
      })
      return resp
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }
}

module.exports = UserController
