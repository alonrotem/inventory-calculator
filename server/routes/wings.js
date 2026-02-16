const express = require('express');
const router = express.Router();
const wings = require('../services/wings');
const { logger } =  require('../logger');
const auth_request = require('../middleware/auth_request');

router.get('/', 
  auth_request([{requiredArea:'wings', requiredPermission:'R'}]),
  async function(req, res, next) {
  logger.info(`get /wings/ page=${req.query.page}, perPage=${req.query.perPage}`);
  try {
    const response = await wings.getMultiple(req.query.page, req.query.perPage);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error getting wings: ${err.message}`);
    next(err);
  }
});

  router.get('/names', 
    auth_request([{requiredArea:'wings', requiredPermission:'R'}]),
    async function(req, res, next) {
    logger.info(`get /wings/names`);
    try {
      const response = await wings.getWingNames();
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting wing names ${err.message}`);
      next(err);
    }
  });

  router.get('/allwingsandbabies/:wing_id', 
    auth_request([{requiredArea:'wings', requiredPermission:'R'}, {requiredArea:'wings_through_orders', requiredPermission:'R'}]),
    async function(req, res, next) {
    logger.info(`get /wings/allwingsandbabies/${req.params.wing_id}`);
    try {
      const response = await wings.getAllNonCustomerWingsAndBabies(req.params.wing_id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting all wings & babies for wing_id ${req.params.wing_id}: ${err.message}`);
      next(err);
    }    
  })

  router.get('/customer/:id', async function(req, res, next) {
    auth_request([{requiredArea:'wings', requiredPermission:'R'}]),
    logger.info(`get /wings/customer/${req.params.id}`);
    try {
      const response = await wings.getWingsForCustomer(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting wings for customer ${req.params.id}: ${err.message}`);
      next(err);
    }
  });

  router.get('/:id', 
    auth_request([{requiredArea:'wings', requiredPermission:'R'}, {requiredArea: 'wings_through_orders', requiredPermission:'R'}]),
    async function(req, res, next) {
    logger.info(`get /wings/${req.params.id}`);
    try {
      const response = await wings.getSingle(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting wing with ID ${ req.params.id }: ${err.message}`);
      next(err);
    }
  });

  router.get('/names/:name', 
    auth_request([{requiredArea:'wings', requiredPermission:'R'}]),
    async function(req, res, next) {
    logger.info(`get /wings/names/${req.params.name}`);
    try {
      const response = await wings.getSingleWingByName(req.params.name);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting wing with name ${ req.params.name }: ${err.message}`);
      next(err);
    }
  });

  router.put('/', 
    auth_request([{requiredArea:'wings', requiredPermission:'U'}]),
    async function(req, res, next) {
    logger.info(`put /wings/`);
    try {
      logger.debug(`Body: ${ JSON.stringify(req.body) }`)
      const response = await wings.save(req.body);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error saving wing: ${err.message}`);
      next(err);
    }
  });

  router.delete('/:id', 
    auth_request([{requiredArea:'wings', requiredPermission:'D'}]),
    async function(req, res, next) {
    logger.info(`delete /wings/${req.params.id}`);
    try {
      const response = await wings.remove(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      consolelogger.error(`Error deleting wing ${err.message}`);
      next(err);
    }
  });

module.exports = router;