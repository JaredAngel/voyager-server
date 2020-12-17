/* eslint-disable quotes */
const path = require('path');
const express = require('express');
const xss = require('xss');
const ActivitiesService = require('./activities-service');
const logger = require('../logger');

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
    const { title, content, label, voyage_id } = req.body;
    const newActivity = { title, content, label, voyage_id };

    for(const [key, value] of Object.entries(newActivity)) {
      if(!value) {
        logger.error(`${key} is required`);
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    ActivitiesService.insertActivity(
      req.app.get('db'),
      newActivity
    )
      .then(activity => {
        logger.info(`Activity with id ${activity.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(serializeActivity(activity));
      })
      .catch(next);
  });

activitiesRouter
  .route('/:activity_id')
  .all((req, res, next) => {
    ActivitiesService.getById(
      req.app.get('db'),
      req.params.activity_id
    )
      .then(activity => {
        if (!activity) {
          return res.status(404).json({
            error: { message: `Activity doesn't exist` }
          });
        }
        res.activity = activity; // save the activity
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeActivity(res.activity));
  })
  .delete((req, res, next) => {
    ActivitiesService.deleteActivity(
      req.app.get('db'),
      req.params.activity_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, content, label } = req.body;
    const activityToUpdate = { title, content, label };

    const numberOfValues = Object.values(activityToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'content', or 'label'`
        }
      });

    ActivitiesService.updateactivity(
      req.app.get('db'),
      req.params.activity_id,
      activityToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = activitiesRouter;