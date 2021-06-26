const { Badge, UserBadge } = require('../models/relations')
const logger = require('../logging/logger')

class BadgeController {
  static async createBadge (badge) {
    try {
      if (badge.upvotes > 20) {
        const createdBadge = await Badge.create(badge)

        return {
          message: 'badge created',
          createdBadge
        }
      }
      return {
        message: 'you need atleast 20 upvotes to make the badge'
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getBadge (badgeId) {
    try {
      const badge = await Badge.findByPk(badgeId)
      return { badge }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllBadges () {
    try {
      const badges = await Badge.findAll()
      console.log(badges)
      return badges
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getCompletedBadge (userId) {
    try {
      let userBadge = await UserBadge.findAll({ where: { UserUserId: userId }, raw: true })
      console.log(userBadge)
      userBadge = userBadge.filter((u) => {
        return u.inProgress === false
      })
      // console.log(userBadge)
      // let arr = []
      // let u
      // for (let i = 0; i < userBadge.length; i++) {
      //     u = userBadge[i]
      //     if (!arr.includes(u.BadgeBadgeId)) {
      //         arr.push(u.BadgeBadgeId)
      //     }
      //     continue
      // }
      // arr = await Promise.all(arr.map(async(a) => {
      //     u = await Badge.findByPk(a)
      //     return u
      // }))
      return { userBadge }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getInProgressBadge (userId) {
    try {
      const userBadge = await UserBadge.findAll({ where: { UserUserId: userId } })
      console.log(userBadge)
      userBadge.filter((u) => {
        return u.inProgress === true
      })
      console.log(userBadge)
      let arr = []
      let u
      for (let i = 0; i < userBadge.length; i++) {
        u = userBadge[i]
        if (!arr.includes(u.BadgeBadgeId)) {
          arr.push(u.BadgeBadgeId)
        }
        continue
      }
      arr = await Promise.all(arr.map(async (a) => {
        u = await Badge.findByPk(a)
        return u
      }))
      return { arr }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }
}

module.exports = BadgeController
