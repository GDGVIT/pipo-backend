const { Badge } = require('../models/relations')
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
}

module.exports = BadgeController
