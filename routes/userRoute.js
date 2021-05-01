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
    const token = jwt.sign(JSON.stringify(user.createdUser), process.env.JWT_PASS)
    user.token = token
  }
  return res.status(user.status).send(user)
})

// router.post('/signup', [
//     check('email').isEmail(),
//     check('password').isLength({ min: 8, max: 32 }),
//     check('isAdmin').isBoolean()
// ], async(req, res) => {
//     validate(req, res)

//     if (req.body.isAdmin === true) {
//         return res.status(406).send({ message: 'User cannot be created' })
//     }

//     const salt = bcrypt.genSaltSync(parseInt(process.env.SALT))
//     req.body.password = bcrypt.hashSync(req.body.password, salt)
//     const response = await userController.createUserSignup(req.body)

//     if (!response.isError) {
//         const token = jwt.sign(JSON.stringify(response.createdAuth), process.env.JWT_PASS)
//         response.token = token
//     }
//     return res.status(response.status).send(response)
// })

// // remember me
// // jwt expire

// router.post('/login', async(req, res) => {
//     const user = await userController.getAuthByEmail(req.body)
//     if (!user.isError) {
//         const match = bcrypt.compareSync(req.body.password, user.password)
//         const token = jwt.sign(JSON.stringify(user), process.env.JWT_PASS)
//         return res.status(match ? 200 : 400).send({ user, token })
//     } else {
//         console.log(user)
//         return res.status(401).send({ message: 'User not authorized', m: user.message })
//     }
// })

// router.get('/findAuth', [notAdmin], async(req, res) => {
//     const user = await userController.findOne({ where: { userId: req.user.userId } });
//     return res.status(200).send(user);
// })

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

module.exports = router
