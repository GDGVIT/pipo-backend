const posts = require('../controllers/postsController')
const express = require('express')
const router = express.Router()
const fs = require('fs')

const jwtAuth = require('../middlewares/jwtAuthMiddleware')

// Cloudinary

require('dotenv').config()
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// Multer

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.claims.userId + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.post('/', [jwtAuth], uploads.single('post'), async (req, res) => {
  try {
    req.body.userId = req.claims.userId
    if (req.file) {
      await cloudinary.uploader.upload('./uploads/' +
                req.claims.userId + req.file.originalname,
      async function (error, result) {
        if (error) {
          return res.status(error.http_code).send(error.message)
        }
        req.body.image = [result.secure_url]
        const response = await posts.createPost(req.body)
        fs.unlinkSync('./uploads/' + req.claims.userId + req.file.originalname)
        return res.status(response.isError ? 400 : 200).json({ response })
      })
    }

    const response = await posts.createPost(req.body)
    return res.status(response.isError ? 400 : 200).json({ response })
  } catch (e) {
    return res.status(400).send({ message: 'File not provided' })
  }
})

router.patch('/:postId', [jwtAuth], async (req, res) => {
  try {
    console.log(req.file)
    if (req.file) {
      await cloudinary.uploader.upload('./uploads/' +
                req.claims.userId + req.file.originalname,
      async function (error, result) {
        if (error) {
          return res.status(error.http_code).send(error.message)
        }
        req.body.image = [result.secure_url]
        const response = await posts.updatePosts(req.body)
        fs.unlinkSync('./uploads/' + req.claims.userId + req.file.originalname)
        return res.status(response.isError ? 400 : 200).json({ response })
      })
    }
    const response = await posts.updatePosts(req.body, req.params.postId)
    fs.unlinkSync('./uploads/' + req.claims.userId + req.file.originalname)
    return res.status(response.isError ? 400 : 200).json({ response })
  } catch (e) {
    return res.status(400).send({ message: 'File not provided' })
  }
})

router.delete('/:postId', [jwtAuth], async (req, res) => {
  const response = await posts.deletePosts(req.params.postId)
  return res.status(response.isError ? 400 : 200).json({ response })
})

router.post('/comments/', [jwtAuth], async (req, res) => {
  const response = await posts.createComment(req.body, req.claims.userId)
  return res.status(response.isError ? 400 : 200).json({ response })
})

router.get('/', [jwtAuth], async (req, res) => {
  const response = await posts.getAllPosts(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/allLatestPosts', async (req, res) => {
  const response = await posts.getAllUsersLatestPosts()
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/allLatestPosts/:noOfUsers', async (req, res) => {
  const response = await posts.getXLatestPosts(req.params.noOfUsers)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/postsByBadgeName/:badgeId/:noOfUsers', async (req, res) => {
  const response = await posts.getPostsByBadgeName(req.params.badgeId, req.params.noOfUsers)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/myLatestPost', [jwtAuth], async (req, res) => {
  const response = await posts.getMyLatestPost(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.post('/postsOfAChallenge', [jwtAuth], async (req, res) => {
  const response = await posts.getPostsOfAChallange(req.body.badgeName, req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.post('/getPost/:postId', [jwtAuth], async (req, res) => {
  const response = await posts.getPost(req.params.postId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.post('/upvote', [jwtAuth], async (req, res) => {
  const response = await posts.upvote(req.body.postId, req.claims.userId)
  if (response.isError) {
    return res.status(400).send(response)
  }
  return res.status(response.statusCode).send(response)
})

router.post('/removeUpvote', [jwtAuth], async (req, res) => {
  const response = await posts.removeUpvote(req.body.postId, req.claims.userId)
  if (response.isError) {
    return res.status(400).send(response)
  }
  return res.status(response.statusCode).send(response)
})

router.get('/getComments/:postId', [jwtAuth], async (req, res) => {
  const response = await posts.getComments(req.params.postId)
  return res.status(response.statusCode).send(response.response)
})

router.get('/of/:userId', async (req, res) => {
  const response = await posts.getAllPostsOf(req.params.userId)
  return res.status(response.statusCode).send(response)
})

router.get('/of/:userId/:number', async (req, res) => {
  const response = await posts.getFewPostsOf(req.params.userId, req.params.number)
  return res.status(response.statusCode).send(response)
})

router.get('/filter/:badgeId/:userId', async (req, res) => {
  const response = await posts.filterPostsForBadge(req.params.badgeId, req.params.userId)
  return res.status(response.statusCode).send(response)
})

module.exports = router
