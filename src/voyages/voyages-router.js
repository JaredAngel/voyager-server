/* eslint-disable quotes */
const path = require('path');
const express = require('express');
const xss = require('xss');
const VoyagesService = require('./voyages-service');

const voyagesRouter = express.Router();
const jsonParser = express.json();

const serializeVoyage = voyage => ({
  id: voyage.id,
  title: xss(voyage.title),
  created_ts: voyage.created_ts,
  author_id: voyage.author_id,
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
    const { title, author } = req.body;
    const newVoyage = { title };

    for(const [key, value] of Object.entries(newVoyage)) {
      if(!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    newVoyage.author_id = author;
    VoyagesService.insertVoyage(
      req.app.get('db'),
      newVoyage
    )
      .then(voyage => {
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
          return res
            .json({
              error: { message: `Article doesn't exist` }
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

  });

module.exports = voyagesRouter;