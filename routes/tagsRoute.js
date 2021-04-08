const tags = require('../controllers/tagsController')
const express = require('express')
const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuthMiddleware')

router.post('/', [jwtAuth], async (req, res) => {
  const response = await tags.createTag(req.body.tag, req.claims.email)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.get('/', [jwtAuth], async (req, res) => {
  const response = await tags.getAllTags(req.claims.userId)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.delete('/', [jwtAuth], async (req, res) => {
  const response = await tags.deleteTags(req.body.arrIndex, req.claims.email)
  return res.status(response.isError ? 400 : 200).send(response)
})

router.delete('/all', [jwtAuth], async (req, res) => {
  const response = await tags.deleteAllTags(req.claims.email)
  return res.status(response.isError ? 400 : 200).send(response)
})

module.exports = router
