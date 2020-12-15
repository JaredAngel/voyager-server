const path = require('path');
const express = require('express');
const xss = require('xss');
const ActivitiesService = require('./activities-service');

const activitiesRouter = express.Router();
const jsonParser = express.json();

const serializeActivity = activity => ({
  id: activity.id,
  title: xss(activity.title),
  label: xss(activity.label),
  content: xss(activity.content),
  created_ts: activity.created_ts,
  voyage_id: activity.voyage_id,
});

activitiesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ActivitiesService.getAllActivities(knexInstance)
      .then(activities => {
        res.json(activities.map(serializeActivity));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, label, created_ts, voyage_id } = req.body; // add user_id?
    const newActivity = { title, content, label, voyage_id };

    for(const [key, value] of Object.entries(newActivity)) {
      if(!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    newActivity.created_ts = created_ts;

    ActivitiesService.insertActivity(
      req.app.get('db'),
      newActivity
    )
      .then(activity => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(serializeActivity(activity));
      })
      .catch(next);
  });