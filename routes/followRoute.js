const follow = require('../controllers/followController')
const express = require('express')
const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuthMiddleware')

// To follow someone (wants to become a follow of another user (userId of the person to be followed is given))
router.post('/follower/:followWhomId', [jwtAuth], async (req, res) => {
  const response = await follow.followSomeone(req.claims.email, req.params.followWhomId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/', [jwtAuth], async (req, res) => {
  const response = await follow.getAllfollows(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.delete('/', [jwtAuth], async (req, res) => {
  const response = await follow.deletefollow(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

module.exports = router
