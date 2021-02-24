const badge = require('../controllers/badgeController');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const response = await badge.createBadge(req.body);
  return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/', async (req, res) => {
  const response = await badge.getAllBadges();
  return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/:badgeId', async (req, res) => {
  const response = await badge.getBadge(req.params.badgeId);
  return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;
