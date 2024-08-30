const express = require('express');
const router = express.Router();
const wings = require('../services/wings');

router.get('/', async function(req, res, next) {
    try {
      res.json(await wings.getMultiple(req.query.page, req.query.perPage));
    } catch (err) {
      console.error(`Error while getting raw materials `, err.message);
      next(err);
    }
  });

  router.get('/positions', async function(req, res, next) {
    try {
      res.json(await wings.getWingBabyPositions());
    } catch (err) {
      console.error(`Error while getting raw materials `, err.message);
      next(err);
    }
  });

  router.get('/:id', async function(req, res, next) {
    try {
      res.json(await wings.getSingle(req.params.id));
    } catch (err) {
      console.error(`Error while getting raw material with ID ${ req.params.id }`, err.message);
      next(err);
    }
  });

  router.post('/', async function(req, res, next) {
    try {
      res.json(await wings.create(req.body));
    } catch (err) {
      console.error(`Error while creating raw material`, err.message);
      next(err);
    }
  });

  router.put('/:id', async function(req, res, next) {
    try {
      res.json(await wings.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating raw material`, err.message);
      next(err);
    }
  });

  router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await wings.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting raw material`, err.message);
      next(err);
    }
  });

module.exports = router;