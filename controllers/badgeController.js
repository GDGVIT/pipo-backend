const { Badge, UserBadge } = require('../models/relations')
const logger = require('../logging/logger')

class BadgeController {
  static async createBadge (badge) {
    try {
      if (badge.upvotes > 20) {
        const badgeFound = await Badge.findOne({ where: { badgeName: badge.badgeName } })
        if (badgeFound) {
          return {
            message: 'Badge with this name already exists',
            isError: true
          }
        }

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

      if (!badge) {
        return {
          message: 'Badge not found',
          isError: true
        }
      }

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
      let userBadge = await UserBadge.findAll({ where: { UserUserId: userId } })
      userBadge = userBadge.filter((u) => {
        return u.inProgress === false
      })
      let completedbadges = []
      let u
      for (let i = 0; i < userBadge.length; i++) {
        u = userBadge[i]
        if (!completedbadges.includes(u.BadgeBadgeId)) {
          completedbadges.push(u.BadgeBadgeId)
        }
        continue
      }
      completedbadges = await Promise.all(completedbadges.map(async (a) => {
        u = await Badge.findByPk(a)
        return u
      }))
      return { completedbadges }
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
      let userBadge = await UserBadge.findAll({ where: { UserUserId: userId } })
      userBadge = userBadge.filter((u) => {
        return u.inProgress === true
      })
      let inProgressbadges = []
      let u
      for (let i = 0; i < userBadge.length; i++) {
        u = userBadge[i]
        if (!inProgressbadges.includes(u.BadgeBadgeId)) {
          inProgressbadges.push(u.BadgeBadgeId)
        }
        continue
      }
      inProgressbadges = await Promise.all(inProgressbadges.map(async (a) => {
        u = await Badge.findByPk(a)
        return u
      }))
      return { inProgressbadges }
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
