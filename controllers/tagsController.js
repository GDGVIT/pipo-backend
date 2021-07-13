const { User } = require('../models/relations')
const logger = require('../logging/logger')

class TagsController {
  static async createTag (tag, email) {
    try {
      const tagsFound = await User.findAll({ where: { email: email }, raw: true })
      tag = tag.split(',')
      tag.filter(function (e) { return true })
      if (tagsFound[0].tags == null) {
        const val = {}
        val.tags = tag
        const updatedUser = await User.update(val, { where: { email: email } })
        return {
          message: 'Added first tag',
          updatedUser
        }
      }
      let arr = tagsFound[0].tags
      arr = arr.concat(tag)
      const val = {}
      val.tags = arr
      const updatedUser = await User.update(val, { where: { email: email } })
      return { message: 'Added tag', updatedUser }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllTags (userId) {
    try {
      const user = await User.findByPk(userId)
      if ((user.tags) == null) {
        return {
          message: 'Empty List, start filling some today'
        }
      }
      return user.tags
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async deleteTags (arrIndex, email) {
    try {
      const tagsFound = await User.findAll({ where: { email: email } })
      if (tagsFound[0].tags == null || tagsFound[0].tags.length === 0) {
        return {
          message: 'Todo doesn\'t exist, so can\'t delete anything from it'

        }
      }
      const arr = tagsFound[0].tags
      arr.splice(arrIndex, 1)
      tagsFound[0].tags = arr
      const val = {}
      val.tags = tagsFound[0].tags
      const updatedUser = await User.update(val, { where: { email: email } })
      return { message: 'Deleted tag', updatedUser }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async deleteAllTags (email) {
    try {
      const tagsFound = await User.findAll({ where: { email: email } })
      if (tagsFound[0].tags == null || tagsFound[0].tags.length === 0) {
        return {
          message: 'Tags don\'t exist, so can\'t delete anything from it'

        }
      }
      const val = {}
      val.tags = []
      const updatedUser = await User.update(val, { where: { email: email } })
      return { message: 'Deleted all tags, empty list', updatedUser }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }
}

module.exports = TagsController
