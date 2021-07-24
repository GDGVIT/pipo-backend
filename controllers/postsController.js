const { Post, Badge, UserBadge, User, Comment, Follow } = require('../models/relations')
const logger = require('../logging/logger')

const _MS_PER_DAY = 1000 * 60 * 60 * 24
const DEDUCT_POINTS = 2

class PostsController {
  static async dateDiffInDays (a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    return Math.floor((utc2 - utc1) / _MS_PER_DAY)
  }

  static async createPost (post) {
    try {
      post.postNumber = 0

      if (post.tags) { post.tags = post.tags.split(',') }
      if (post.badgeName) {
        // Handle if badge not found

        const badge = await Badge.findOne({ where: { badgeName: post.badgeName } })
        if (!badge) {
          return {
            isError: true,
            message: 'Badge not found'
          }
        }

        // Check if streak can be recovered

        // Check if user has already started with the badge

        let userBadge = await UserBadge.findOne({ where: { BadgeBadgeId: badge.badgeId, UserUserId: post.userId } })
        console.log('1')
        // First post

        if (!userBadge) {
          const userBadgeContent = {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId,
            daysLeft: badge.days - 1,
            inProgress: true
          }
          const postCreated = await Post.create(post)

          // Create and update userBadge

          userBadge = await UserBadge.create(userBadgeContent)
          post.postNumber = badge.days - userBadge.daysLeft

          if (!userBadge.daysLeft) {
            userBadge.inProgress = false
            userBadge = await UserBadge.update(userBadge, {
              where: {
                BadgeBadgeId: badge.badgeId,
                UserUserId: post.userId
              }
            })
          }

          return { postCreated: postCreated }
        }

        let isComplete = false

        // Check if a user is posting on a completed challenge

        if (userBadge.daysLeft === 0) {
          post.postNumber = null
          const postCreated = await Post.create(post)
          isComplete = true
          return {
            message: 'This challenge has been completed by you',
            postCreated,
            isComplete
          }
        }

        // If more posts are posted on the same day for a badge

        const date = new Date()

        const lastPost = await Post.findOne({ where: { userId: post.userId, badgeName: post.badgeName, postNumber: (badge.days - userBadge.daysLeft) }, raw: true })

        if (!lastPost) {
          return {
            message: 'No last post exists'
          }
        }
        console.log('#')

        const diff = await this.dateDiffInDays(lastPost.createDate, date)

        if (!diff) {
          post.postNumber = null
          const postNewCreated = await Post.create(post)
          return { message: 'You already posted for today, created this as a new post in the badge', postCreated: postNewCreated }
        }

        // Let user start the badge afresh if his streak is broken

        if (diff > 1) {
          return {
            message: 'Streak broken : either restart streak or use points to continue, Post was not made yet',
            isStreakBroken: true
          }
        }

        // create new post under badge and check if it is last post, or if challenge is completed

        const obj = {
          daysLeft: userBadge.daysLeft - 1
        }

        let message = `${obj.daysLeft} day(s) is/are left for your challenge`

        if (obj.daysLeft === 0) {
          obj.inProgress = false
          message = 'Congratulations!! You completed the challenge'
          isComplete = true
        }

        const resp = await UserBadge.update(obj, {
          where: {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId
          }
        })
        post.postNumber = badge.days - userBadge.daysLeft + 1
        const postCreated = await Post.create(post)
        return { postCreated: postCreated, resp: resp, message, isComplete }
      }

      // without badge post

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

  static async restartToContinue (post) {
    try {
      if (post.badgeName) {
        const allPosts = await Post.findAll({ where: { userId: post.userId, badgeName: post.badgeName }, raw: true })
        const badge = await Badge.findOne({ where: { badgeName: post.badgeName }, raw: true })

        if (allPosts) {
          await Promise.all(allPosts.map(async (postk) => {
            postk.postNumber = null
            await Post.update(postk, { where: { postId: postk.postId, userId: postk.userId, badgeName: postk.badgeName } })
          }))

          const updateUserBadge = {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId,
            daysLeft: badge.days - 1,
            inProgress: true
          }

          await UserBadge.update(updateUserBadge, {
            where: {
              BadgeBadgeId: badge.badgeId,
              UserUserId: post.userId
            }
          })

          post.postNumber = badge.days - updateUserBadge.daysLeft
          const postNewCreated = await Post.create(post)
          return { message: 'You had broken the streak, so starting a new streak', postCreated: postNewCreated }
        }
        return {
          message: "Posts for that badge don't exist",
          isError: true
        }
      }
      return {
        message: "Badge doesn't exist",
        isError: true
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async usePointsToContinue (post) {
    try {
      if (post.badgeName) {
        const badge = await Badge.findOne({ where: { badgeName: post.badgeName }, raw: true })
        const userBadge = await UserBadge.findOne({ where: { BadgeBadgeId: badge.badgeId, UserUserId: post.userId } })
        const user = await User.findOne({ where: { userId: post.userId }, raw: true })
        if (!userBadge) {
          return {
            message: 'Create a post using post request before you use this route to maintain a streak'
          }
        }
        if (userBadge.daysLeft <= 0) {
          post.postNumber = null
          const postNewCreated = await Post.create(post)
          return {
            message: 'Badge already completed by you',
            postNewCreated
          }
        }
        const newUser = {}
        newUser.points = user.points - DEDUCT_POINTS

        await User.update(newUser, { where: { userId: post.userId } })

        const deduct = `${DEDUCT_POINTS} points were deducted from your account`

        const obj = {
          daysLeft: userBadge.daysLeft - 1
        }

        let message = `${obj.daysLeft} day(s) is/are left for your challenge`
        let isComplete = false
        if (obj.daysLeft === 0) {
          obj.inProgress = false
          message = 'Congratulations!! You completed the challenge'
          isComplete = true
        }

        const resp = await UserBadge.update(obj, {
          where: {
            BadgeBadgeId: badge.badgeId,
            UserUserId: post.userId
          }
        })
        post.postNumber = badge.days - userBadge.daysLeft + 1
        const postCreated = await Post.create(post)
        return { postCreated, resp, message, isComplete, deduct }
      }
      return {
        message: "Badge doesn't exist",
        isError: true
      }
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
      if (!post) {
        return {
          message: "Post doesn't exist",
          isError: true
        }
      }
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

  static async updatePosts (updation, postId) {
    try {
      const post = await Post.findByPk(postId)

      if (updation.tags) {
        updation.tags = updation.tags.split(',')
      }

      if (updation.upvotes) {
        delete updation.upvotes
      }

      if (post) {
        const update = await Post.update(updation, { where: { postId } })
        return { update }
      }

      return { message: 'No such posts exist' }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async deletePosts (postId, userId) {
    try {
      const post = await Post.findOne({ where: { postId, userId }, raw: true })

      if (post) {
        if (post.badgeName && post.postNumber) {
          return {
            message: "Post can't be deleted, it is part of a badge. You can try updating the post instead",
            isError: true
          }
        }

        const deleted = await Post.destroy({ where: { postId } })
        return { deleted }
      }
      return { message: 'No such posts exist or you are accessing a forbidden resource' }
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

  // Upvotes

  static async upvote (postId, userId) {
    try {
      let post = await Post.findOne({ where: { postId }, raw: true })
      if (!post) {
        return {
          isError: true,
          message: 'No such post exists'
        }
      }
      if (!post.upvotes) {
        post.upvotes = []
      }
      if (post.upvotes.includes(userId)) {
        return { message: 'Already upvoted', statusCode: 409 }
      }
      const arr = {}
      arr.upvotes = post.upvotes
      arr.upvotes.push(userId)

      let user = await User.findOne({ where: { userId: post.userId }, raw: true })
      user.points += 1
      user = await User.update(user, { where: { userId: post.userId } })
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
      if (post) {
        if (!post.upvotes) {
          post.upvotes = []
        }
        if (post.upvotes.includes(userId)) {
          const arr = {}
          arr.upvotes = post.upvotes
          arr.upvotes.pop(userId)

          let user = await User.findOne({ where: { userId: post.userId }, raw: true })
          user.points -= 1
          user = await User.update(user, { where: { userId: post.userId } })

          post = await Post.update(arr, { where: { postId } })
          return { message: 'Vote removed', statusCode: 200 }
        }
        return { message: 'upvote before you remove the vote', statusCode: 409 }
      }
      return { message: "Posts doesn't exist", statusCode: 404 }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  // CRUD for comments

  static async createComment (comment, userId) {
    try {
      const user = await User.findByPk(userId)
      comment.userName = user.userName
      comment.picture = user.picture
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

  static async getComments (postId) {
    try {
      let comments = await Comment.findAll({ where: { postId: postId }, raw: true })
      let user
      comments = await Promise.all(comments.map(async (comment) => {
        user = await User.findOne({
          where: { userName: comment.userName },
          raw: true
        })
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

  /* eslint-disable no-unused-vars */

  static async updateComment (commentId, comment, userId) {
    try {
      const commentExists = await Comment.findByPk(commentId)
      if (commentExists) {
        const user = await User.findByPk(userId)

        if (user.userName === commentExists.userName) {
          const _ = Comment.update(comment, { where: { commentId: commentId } })
          return { updatedComment: 'Updated' }
        }
        return {
          message: 'You are not authorized to update these resources'
        }
      }
      return {
        message: "Comment doesn't exist",
        isError: true
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async deleteComment (commentId, userId) {
    try {
      const commentExists = await Comment.findByPk(commentId)
      if (commentExists) {
        const user = await User.findByPk(userId)

        if (user.userName === commentExists.userName) {
          const _ = Comment.destroy({ where: { commentId: commentId } })
          return { deletedComment: 'deleted comment' }
        }
        return {
          message: 'You are not authorized to delete these resources'
        }
      }
      return {
        message: "Comment doesn't exist",
        isError: true
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  /* eslint-disable no-unused-vars */

  // General post controllers

  static async sortXByY (arr) {
    return arr.sort((a, b) => a.points - b.points)
  }

  static async getAllUsersLatestPosts () {
    try {
      let users = await User.findAll()

      users = await this.sortXByY(users)
      let posts = await Promise.all(users.map(async (user) => {
        let post = await Post.findAll({
          where: { userId: user.userId }
        })
        post = post.sort((a, b) => b.createDate - a.createDate).reverse()

        const last = post[0]
        if (last) {
          last.setDataValue('points', user.points)
          last.setDataValue('username', user.userName)
          last.setDataValue('picture', user.picture)
        }
        return last
      }))

      posts = posts.filter(function (e) { return e != null })

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
      let posts = await Promise.all(users.map(async (user) => {
        let post = await Post.findAll({
          where: { userId: user.userId }
        })
        post = post.sort((a, b) => b.createDate - a.createDate).reverse()
        const last = post[0]
        if (last) {
          last.setDataValue('points', user.points)
          last.setDataValue('username', user.userName)
          last.setDataValue('picture', user.picture)
        }
        return last
      }))
      const num = parseInt(noOfUsers)

      posts = posts.filter(function (e) { return e != null })

      return { posts: posts.slice(0, num) }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString()
      }
    }
  }

  static async getPostsByBadge (badgeId, noOfUsers) {
    try {
      const badge = await Badge.findByPk(badgeId)
      let users = await User.findAll()

      users = await this.sortXByY(users)
      let posts = await Promise.all(users.map(async (user) => {
        const post = await Post.findAll({
          where: { userId: user.userId, badgeName: badge.badgeName }
        })
        const last = post[post.length - 1]
        if (last) {
          last.setDataValue('points', user.points)
          last.setDataValue('username', user.userName)
          last.setDataValue('picture', user.picture)
        }
        return last
      }))
      const num = parseInt(noOfUsers)

      posts = posts.filter(function (e) { return e != null })

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
        where: { userId: userId },
        raw: true
      })
      if (post.length === 0) {
        return {
          message: 'No latest post yet.',
          title: 'Start your journey today!',
          description: 'No Latest Post yet! Well, this is the beginning of your journey why not add some posts and see what others think about it 🤔. Pick out any challenge you like and work on it🔥. Lost? You can always check out the details by clicking on the logo on top 😊',
          image: ['https://i.imgur.com/HuNalGN.png']
        }
      }
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

  static async getAllPostsOf (userId) {
    try {
      const posts = await Post.findAll({ where: { userId: userId } })
      const user = await User.findByPk(userId)
      return {
        picture: user.picture,
        userName: user.userName,
        posts,
        statusCode: 200
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        statusCode: 400
      }
    }
  }

  static async getFewPostsOf (userId, number) {
    try {
      const posts = await Post.findAll({ where: { userId: userId } })
      const user = await User.findByPk(userId)
      return {
        picture: user.picture,
        userName: user.userName,
        posts: posts.slice(0, number),
        statusCode: 200
      }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        statusCode: 400
      }
    }
  }

  static async filterPostsForBadge (badgeId, userId) {
    try {
      const badge = await Badge.findByPk(badgeId)
      const response = await Post.findAll({ where: { badgeName: badge.badgeName, userId }, raw: true })
      const user = await User.findByPk(userId)
      return { picture: user.picture, userName: user.userName, response, statusCode: 200 }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        statusCode: 400
      }
    }
  }

  static async getFollowerLatestPosts (userId) {
    try {
      const following = await Follow.findAll({ where: { followerId: userId }, raw: true })

      let posts = await Promise.all(following.map(async (f) => {
        let post = await Post.findAll({
          where: { userId: f.followingId },
          raw: true
        })
        const user = await User.findOne({ where: { userId: f.followingId }, raw: true })
        post = post.sort((a, b) => b.createDate - a.createDate).reverse()

        const latestPost = post[0]
        if (post[0]) {
          latestPost.userName = user.userName
          latestPost.picture = user.picture
          latestPost.points = user.points
        }
        return latestPost
      }))

      posts = posts.filter(function (e) { return e != null })

      return { posts, statusCode: 200 }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        statusCode: 400
      }
    }
  }

  static async getFollowerPosts (userId) {
    try {
      const following = await Follow.findAll({ where: { followerId: userId }, raw: true })

      const posts = await Promise.all(following.map(async (f) => {
        const postList = await Post.findAll({ where: { userId: f.followingId } })
        const user = await User.findOne({ where: { userId: f.followingId } })
        return { user, postList }
      }))

      return { posts, statusCode: 200 }
    } catch (e) {
      logger.error(e)
      return {
        isError: true,
        message: e.toString(),
        statusCode: 400
      }
    }
  }
}

module.exports = PostsController
