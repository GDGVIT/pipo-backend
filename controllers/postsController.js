// const { User, Post } = require('../models/relations')

require('dotenv').config()

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

class PostsController {
  static async createPost (post) {

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
