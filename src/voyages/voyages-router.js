/* eslint-disable quotes */
const path = require('path');
const express = require('express');
const xss = require('xss');
const VoyagesService = require('./voyages-service');
const logger = require('../logger');

const voyagesRouter = express.Router();
const jsonParser = express.json();

const serializeVoyage = voyage => ({
  id: voyage.id,
  title: xss(voyage.title),
  created_ts: voyage.created_ts,
});

voyagesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    VoyagesService.getAllVoyages(knexInstance)
      .then(voyages => {
        res.json(voyages.map(serializeVoyage));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title } = req.body;
    const newVoyage = { title };

    for(const [key, value] of Object.entries(newVoyage)) {
      if(!value) {
        logger.error(`${key} is required`);
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    
    VoyagesService.insertVoyage(
      req.app.get('db'),
      newVoyage
    )
      .then(voyage => {
        logger.info(`Voyage with id ${voyage.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${voyage.id}`))
          .json(serializeVoyage(voyage));
      })
      .catch(next);
  });

voyagesRouter
  .route('/:voyage_id')
  .all((req, res, next) => {
    VoyagesService.getById(
      req.app.get('db'),
      req.params.voyage_id
    )
      .then(voyage => {
        if(!voyage) {
          return res.status(404)
            .json({
              error: { message: `Voyage doesn't exist` }
            });
        }
        res.voyage = voyage; // save the voyage
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeVoyage(res.voyage));
  })
  .delete((req, res, next) => {
    VoyagesService.deleteVoyage(
      req.app.get('db'),
      req.params.voyage_id
    )
      .then(() => {
        res
          .status(204)
          .end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title } = req.body;
    const voyageToUpdate = { title };

    const numberOfValues = Object.values(voyageToUpdate)
      .filter(Boolean).length;
    if(numberOfValues === 0) {
      return res
        .status(400)
        .json({
          error: { message: `Request body must contain 'title'`}
        });
    }

    VoyagesService.updateVoyage(
      req.app.get('db'),
      req.params.voyage_id,
      voyageToUpdate
    )
      .then(numRowsAffected => {
        res
          .status(204)
          .end();
      })
      .catch(next);
  });

module.exports = voyagesRouter;