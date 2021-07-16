const express = require('express')
const compression = require('compression')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const db = require('./db/db').default
const morgan = require('./logging/morgan')
const rateLimit = require('express-rate-limit')

require('./models/relations')

const routes = require('./routes')
const badgeRoute = require('./routes/badgeRoute')
const userRoute = require('./routes/userRoute')
const todoRoute = require('./routes/todoRoute')
const followRoute = require('./routes/followRoute')
const postsRoute = require('./routes/postsRoute')
const tagsRoute = require('./routes/tagsRoute')

const app = express()

// Connection
app.locals.db = db

app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMITTING_TIME, // 15 minutes
  max: process.env.RATE_LIMITTING_MAX
})

// Middlewares
app.use(express.json())
app.use(compression())
app.use(cors())
// Logging
app.use(morgan)
app.use(limiter)

// Mount routes
app.use('/', routes)
app.use('/badge', badgeRoute)
app.use('/user', userRoute)
app.use('/todo', todoRoute)
app.use('/follow', followRoute)
app.use('/posts', postsRoute)
app.use('/tags', tagsRoute)

module.exports = app
