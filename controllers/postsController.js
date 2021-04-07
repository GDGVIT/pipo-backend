const { Post, Badge, UserBadge } = require('../models/relations')
const logger = require('../logging/logger')

class PostsController {
  static async createPost (post) {
    try {
      post.postNumber = 0
      if (post.badgeName) {
        console.log('BB')
        const badge = await Badge.findOne({ where: { badgeName: post.badgeName } })
        if (!badge) {
          console.log('AA')
          return {
            isError: true,
            message: 'Badge not found'
          }
        }
        let userBadge = await UserBadge.findOne({ where: { BadgeBadgeId: badge.badgeId, UserUserId: post.userId } })
        if (!userBadge) {
          console.log('CC')
          const userBadgeContent = {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId,
            daysLeft: badge.days - 1,
            inProgress: true
          }
          userBadge = await UserBadge.create(userBadgeContent)
          post.postNumber = badge.days - userBadge.daysLeft
        }
        if (userBadge.daysLeft === 0) {
          console.log('DD')
          return {
            isError: true,
            message: 'This challenge has been completed by you'
          }
        }
        userBadge.daysLeft -= 1

        if (userBadge.daysLeft === 0) userBadge.inProgress = false

        console.log(userBadge.daysLeft)
        const resp = await UserBadge.update(userBadge, {
          where: {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId
          }
        })
        console.log(resp)
        post.postNumber = badge.days - userBadge.daysLeft
      }
      console.log(post.postNumber)
      const postCreated = await Post.create(post)
      console.log(postCreated)
      return postCreated
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllPosts (userId) {

  }

  static async getAllUsersLatestPosts () {

  }

  static async getPostsOfAChallange (badgeId) {

  }

  static async getPost (postId) {

  }
}

module.exports = PostsController
