const userController = require('../controllers/userController');

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// const { check, validationResult } = require("express-validator");

// function validate(req, res) {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//         return res.status(422).json({
//             error: error.array()
//         });
//     }
// }

router.post('/oAuth', async (req, res) => {
  const user = await userController.createUser(req.body.idToken);
  if (!user.isError) {
    const token = jwt.sign(JSON.stringify(user.createdAuth), process.env.JWT_PASS);
    user.token = token;
  }
  if (user.isLoggedIn) {
    const token = jwt.sign(JSON.stringify(user.user), process.env.JWT_PASS);
    user.token = token;
    return res.status(200).send(user);
  }
  return res.status(user.isError ? 400 : 201).send(user);
});

// remember me
// jwt expire

// router.get('/findAuth', [notAdmin], async(req, res) => {
//     const user = await User.findOne({ where: { authId: req.user.authId } });
//     return res.status(200).send(user);
// })

// router.get('/allAuths', async(req, res) => {
//     const response = await User.findAll();
//     return res.status(200).send(response);
// });

module.exports = router;
