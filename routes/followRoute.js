const follow = require('../controllers/followController')
const express = require('express')
const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuthMiddleware')

router.post('/toFollow/:followWhomId', [jwtAuth], async (req, res) => {
  const response = await follow.followSomeone(req.claims.userId, req.params.followWhomId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.post('/makeFriend/:makeFriendId', [jwtAuth], async (req, res) => {
  const response = await follow.makeFriend(req.claims.userId, req.params.makeFriendId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/followers/:userId', async (req, res) => {
  const response = await follow.getAllFollowers(req.params.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/following/:userId', async (req, res) => {
  const response = await follow.getAllFollowing(req.params.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/friend/:userId', async (req, res) => {
  const response = await follow.getAllFriends(req.params.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.delete('/stopFollowing/:whom', [jwtAuth], async (req, res) => {
  const response = await follow.stopFollowing(req.claims.userId, req.params.whom)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.delete('/stopFollower/:which', [jwtAuth], async (req, res) => {
  const response = await follow.stopFollower(req.claims.userId, req.params.which)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.delete('/stopFriend/:which', [jwtAuth], async (req, res) => {
  const response = await follow.stopFriend(req.claims.userId, req.params.which)
  return res.status(response.isError ? 400 : 200).send(response)
})

module.exports = router
