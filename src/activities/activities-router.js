const path = require('path');
const express = require('express');
const xss = require('xss');
const ActivitiesService = require('./activities-service');

const activitiesRouter = express.Router();
const jsonParser = express.json();