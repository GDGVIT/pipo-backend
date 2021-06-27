const { User, Follow } = require('../models/relations')

const admin = require('firebase-admin')
const logger = require('../logging/logger')

const serviceAccount = require('../firebase.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pipo-api-oauth-default-rtdb.europe-west1.firebasedatabase.app'
})

let i = 0
const USERNAME_LENGTH_LIMIT = 10

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

      i++
      const userName = 'anon' + i

      const auth = {
        email,
        name,
        picture,
        points: 20,
        isAdmin: true,
        userName
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
      const user = await User.findOne({ where: { userId }, raw: true })
      console.log(user)
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

  static async getUserUserId (userId, myUserId) {
    try {
      const user = await User.findByPk(userId)

      if (user) {
        user.todo = []

        const friends = await Follow.findAll({ where: { isFriend: true, followerId: userId }, raw: true })
        const followers = await Follow.findAll({ where: { followingId: userId }, raw: true })
        const following = await Follow.findAll({ where: { followerId: userId }, raw: true })

        let amIFollowing = await Follow.findAll({ where: { followerId: myUserId, followingId: userId }, raw: true })

        if (amIFollowing.length === 0) {
          amIFollowing = false
        } else amIFollowing = true

        return {
          user,
          friends: friends.length,
          followers: followers.length,
          following: following.length,
          amIFollowing
        }
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

  static checkUserName (username) {
    const re = new RegExp(`^[a-z0-9_@./#&+-]{1,${USERNAME_LENGTH_LIMIT}}$`)
    return re.test(username)
  };

  static async update (user, userId) {
    try {
      if (user.userName === '') {
        return {
          message: "Username can't be empty",
          isError: true
        }
      }

      if (user.userName) {
        const finding = await User.findOne({ where: { userName: user.userName } })
        if (finding && (finding.userId !== userId)) {
          return {
            message: 'User with that userName already exists. Please choose a different userName',
            isError: true
          }
        }
        if (!this.checkUserName(user.userName)) {
          return {
            message: `userName provided doesn't meet the restriction set: 
                        characters allowed = [a-z0-9_@./#&+-]
                        {min length, max length} = {1,${USERNAME_LENGTH_LIMIT}`,
            isError: true
          }
        }
      }

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
