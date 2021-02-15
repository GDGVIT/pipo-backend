const express = require('express');
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./db/db');
const morgan = require('./logging/morgan');

const routes = require('./routes');
// const authRoute = require('./routes/authRoute');

const app = express();

// Connection
app.locals.db = db;

// Middlewares
app.use(express.json());
app.use(compression());
app.use(cors());
// Logging
app.use(morgan);

// Mount routes
app.use('/', routes);
// app.use('/auth', authRoute);

module.exports = app;
