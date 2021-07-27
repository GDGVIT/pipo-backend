const badge = require('../controllers/badgeController')
const express = require('express')
const router = express.Router()

const jwtAuth = require('../middlewares/jwtAuthMiddleware')
const adminAuth = require('../middlewares/adminAuthMiddleware')

router.post('/', [jwtAuth, adminAuth], async (req, res) => {
  const response = await badge.createBadge(req.body)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/', [jwtAuth], async (req, res) => {
  const response = await badge.getAllBadges()
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/getBadge/:badgeId', [jwtAuth], async (req, res) => {
  const response = await badge.getBadge(req.params.badgeId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/inProgress', [jwtAuth], async (req, res) => {
  const response = await badge.getInProgressBadge(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/inProgress/:userId', async (req, res) => {
  const response = await badge.getInProgressBadge(req.params.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/completed', [jwtAuth], async (req, res) => {
  const response = await badge.getCompletedBadge(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/completed/:userId', async (req, res) => {
  const response = await badge.getCompletedBadge(req.params.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

module.exports = router
