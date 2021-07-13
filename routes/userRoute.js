const userController = require('../controllers/userController')
const { User } = require('../models/relations')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const jwtAuth = require('../middlewares/jwtAuthMiddleware')

router.post('/oAuth', async (req, res) => {
  const user = await userController.createUser(req.body.idToken)
  if (user.isLoggedIn) {
    const token = jwt.sign(JSON.stringify(user.user), process.env.JWT_PASS)
    user.token = token
    return res.status(user.status).send(user)
  }
  if (!user.isError) {
    const token = jwt.sign(JSON.stringify(user.user), process.env.JWT_PASS)
    user.token = token
  }
  return res.status(user.status).send(user)
})

router.patch('/update', [jwtAuth], async (req, res) => {
  const response = await userController.update(req.body, req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/getAll', async (req, res) => {
  const response = await User.findAll()
  return res.status(200).send(response)
})

router.get('/getUser', [jwtAuth], async (req, res) => {
  const response = await userController.getUser(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/:userId', [jwtAuth], async (req, res) => {
  const response = await userController.getUserUserId(req.params.userId, req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

module.exports = router
