// const posts = require('../controllers/postsController')
const express = require('express')
const router = express.Router()

const jwtAuth = require('../middlewares/jwtAuthMiddleware')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + req.claims.userId + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('filetype mismatch, allowed filetypes: jpeg, png, mp4'), false)
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
  // const response = await posts.createPost(req.body, req.file)
  // return res.status(response.isError ? 400 : 200).send(response)
  return res.status(200).send(req.file)
})

// router.get('/', [jwtAuth], async(req, res) => {
//     const response = await posts.getAllBadges()
//     return res.status(response.isError ? 400 : 200).send(response)
// })

// router.get('/:badgeId', [jwtAuth], async(req, res) => {
//     const response = await posts.getBadge(req.params.badgeId)
//     return res.status(response.isError ? 400 : 200).send(response)
// })

module.exports = router
