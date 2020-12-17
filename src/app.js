require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');
//const validateBearerToken = require('./validateBearerToken');
const errorHandler = require('./error-handler');

const voyagesRouter = require('./voyages/voyages-router');
const activitiesRouter = require('./activities/activities-router');
const usersRouter = require('./users/users-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//app.use(validateBearerToken);
app.use('/api/voyages', voyagesRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/xss', (req, res) => {
  res.cookie('secretToken', '1234567890');
  res.sendFile(__dirname + '/xss-example.html');
});

app.use(errorHandler);

module.exports = app;
