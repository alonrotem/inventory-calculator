const express = require('express');
const router = express.Router();
const wings = require('../services/wings');

router.get('/', async function(req, res, next) {
    try {
      res.json(await wings.getMultiple(req.query.page, req.query.perPage));
    } catch (err) {
      console.error(`Error while getting wings `, err.message);
      next(err);
    }
  });
/*
  router.get('/positions', async function(req, res, next) {
    try {
      res.json(await wings.getWingBabyPositions());
    } catch (err) {
      console.error(`Error while getting wing positions `, err.message);
      next(err);
    }
  });
*/
  router.get('/names', async function(req, res, next) {
    try {
      res.json(await wings.getWingNames());
    } 
    catch (err) {
      console.error(`Error while getting wing names `, err.message);
      next(err);
    }
  });

  router.get('/allwingsandbabies/:wing_id', async function(req, res, next) {
    try {
      res.json(await wings.getAllNonCustomerWingsAndBabies(req.params.wing_id));
    } 
    catch (err) {
      console.error(`Error while getting all wings & babies `, err.message);
      next(err);
    }    
  })

  router.get('/customer/:id', async function(req, res, next) {
    try {
      res.json(await wings.getWingsForCustomer(req.params.id));
    } 
    catch (err) {
      console.error(`Error while getting wings per customer ${req.params.id} `, err.message);
      next(err);
    }
  });

  router.get('/:id', async function(req, res, next) {
    try {
      res.json(await wings.getSingle(req.params.id));
    } catch (err) {
      console.error(`Error while getting wing with ID ${ req.params.id }`, err.message);
      next(err);
    }
  });

  router.get('/names/:name', async function(req, res, next) {
    try {
      res.json(await wings.getSingleWingByName(req.params.name));
    } catch (err) {
      console.error(`Error while getting wing with name ${ req.params.name }`, err.message);
      next(err);
    }
  });
/*
  router.post('/', async function(req, res, next) {
    try {
      res.json(await wings.create(req.body));
    } catch (err) {
      console.error(`Error while creating wing `, err.message);
      next(err);
    }
  });
*/
  router.put('/', async function(req, res, next) {
    try {
      res.json(await wings.save(req.body));
    } catch (err) {
      console.error(`Error while updating ging `, err.message);
      next(err);
    }
  });

  router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await wings.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting wing `, err.message);
      next(err);
    }
  });

module.exports = router;