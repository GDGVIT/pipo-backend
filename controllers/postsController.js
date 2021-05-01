const { Post, Badge, UserBadge, User, Comment } = require('../models/relations')
const logger = require('../logging/logger')

class PostsController {
  static async createPost (post) {
    try {
      post.postNumber = 0
      if (post.badgeName) {
        const badge = await Badge.findOne({ where: { badgeName: post.badgeName } })
        if (!badge) {
          return {
            isError: true,
            message: 'Badge not found'
          }
        }
        let userBadge = await UserBadge.findOne({ where: { BadgeBadgeId: badge.badgeId, UserUserId: post.userId } })
        console.log(userBadge)
        if (!userBadge) {
          console.log(badge.days)
          const userBadgeContent = {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId,
            daysLeft: badge.days - 1,
            inProgress: true
          }
          console.log(userBadgeContent.daysLeft)
          userBadge = await UserBadge.create(userBadgeContent)
          post.postNumber = badge.days - userBadge.daysLeft
          console.log(post.postNumber, badge.days, userBadge.daysLeft)
          const postCreated = await Post.create(post)
          return { postCreated: postCreated }
        }
        if (userBadge.daysLeft === 0) {
          return {
            isError: true,
            message: 'This challenge has been completed by you'
          }
        }

        userBadge.daysLeft = userBadge.daysLeft - 1
        const obj = {
          daysLeft: userBadge.daysLeft
        }

        if (userBadge.daysLeft === 0) { obj.inProgress = false }
        const resp = await UserBadge.update(obj, {
          where: {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId
          }
        })
        post.postNumber = badge.days - userBadge.daysLeft
        const postCreated = await Post.create(post)
        return { postCreated: postCreated, resp: resp }
      }
      const postCreated = await Post.create(post)
      return { postCreated: postCreated }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async createComment (comment, userId) {
    try {
      const user = await User.findByPk(userId)
      comment.userName = user.userName
      const commentCreated = await Comment.create(comment)
      return commentCreated
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getAllPosts (userId) {
    try {
      const response = await Post.findAll({ userId })
      return response
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async sortXByY (arr) {
    return arr.sort((a, b) => a.points - b.points)
  }

  static async getAllUsersLatestPosts () {
    try {
      let users = await User.findAll()

      users = await this.sortXByY(users)
      const posts = await Promise.all(users.map(async (user) => {
        const post = await Post.findAll({
          where: { userId: user.userId }
        })
        const last = post[post.length - 1]
        if (last) {
          last.setDataValue('points', user.points)
          last.setDataValue('username', user.userName)
          console.log(last)
        }
        return last
      }))

      return { posts }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getXLatestPosts (noOfUsers) {
    try {
      let users = await User.findAll()

      users = await this.sortXByY(users)
      const posts = await Promise.all(users.map(async (user) => {
        const post = await Post.findAll({
          where: { userId: user.userId }
        })
        const last = post[post.length - 1]
        if (last) {
          last.setDataValue('points', user.points)
          last.setDataValue('username', user.userName)
        }
        return last
      }))
      const num = parseInt(noOfUsers)
      return { posts: posts.slice(0, num) }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getPostsByBadgeName (badgeId, noOfUsers) {
    try {
      const badge = await Badge.findByPk(badgeId)
      let users = await User.findAll()

      users = await this.sortXByY(users)
      const posts = await Promise.all(users.map(async (user) => {
        const post = await Post.findAll({
          where: { userId: user.userId, badgeName: badge.badgeName }
        })
        const last = post[post.length - 1]
        if (last) {
          last.setDataValue('points', user.points)
          last.setDataValue('username', user.userName)
        }
        return last
      }))
      const num = parseInt(noOfUsers)
      return { posts: posts.slice(0, num) }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getMyLatestPost (userId) {
    try {
      const post = await Post.findAll({
        where: { userId: userId }
      })
      const last = post[post.length - 1]
      return last
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getPostsOfAChallange (badgeName, userId) {
    try {
      const post = await Post.findAll({
        where: { userId: userId, badgeName: badgeName }
      })
      return post
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getPost (postId) {
    try {
      const post = await Post.findByPk(postId)
      const comments = await Comment.findAll({ where: { postId } })
      return {
        post,
        comments
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async upvote (postId, userId) {
    try {
      let post = await Post.findByPk(postId)
      if (!post.upvoted) {
        post.upvoted = []
      }
      if (post.upvoted.includes(userId)) {
        return { message: 'Already upvoted', statusCode: 409 }
      }
      const arr = {}
      arr.upvoted = post.upvoted
      arr.upvoted.push(userId)
      post = await Post.update(arr, { where: { postId } })
      return { post, statusCode: 200 }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async removeUpvote (postId, userId) {
    try {
      let post = await Post.findByPk(postId)
      if (!post.upvoted) {
        post.upvoted = []
      }
      if (post.upvoted.includes(userId)) {
        const arr = {}
        arr.upvoted = post.upvoted
        arr.upvoted.pop(userId)
        post = await Post.update(arr, { where: { postId } })
        return { message: 'Vote removed', statusCode: 200 }
      }
      return { message: 'upvote before you remove the vote', statusCode: 409 }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getComments (postId) {
    try {
      let comments = await Comment.findAll({ where: { postId: postId } })
      let user
      comments = await Promise.all(comments.map(async (comment) => {
        user = await User.findOne({ userName: comment.userName })
        comment.picture = user.picture
        return comment
      }))
      return { comments }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }
}

module.exports = PostsController
