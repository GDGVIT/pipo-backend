const router = require('express').Router()

router.get('/', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000)
  res.status(200).json({ message: 'Version 1', timestamp })
})

module.exports = router
