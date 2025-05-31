const express = require('express');
const router = express.Router();
const raw_materials = require('../services/raw_materials');
const { logger } =  require('../logger');

/* GET raw materials */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/raw_materials/
*/
router.get('/', async function(req, res, next) {
  logger.info(`get /raw_materials/ page=${req.query.page}, perPage=${req.query.perPage}`);
  try {
    const response = await raw_materials.getMultiple(req.query.page, req.query.perPage);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error getting raw materials ${err.message}`);
    next(err);
  }
});

/* GET raw material */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/raw_materials/10
*/
router.get('/single/:id', async function(req, res, next) {
    logger.info(`get /raw_materials/single/${req.params.id}`);
    try {
      const response = await raw_materials.getSingle(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting raw material with ID ${ req.params.id }: ${err.message}`);
      next(err);
    }
  });

  router.get('/names/:customer_id', async function(req, res, next) {
    logger.info(`get /raw_materials/names/${req.params.id}`);
    try {
      const response = await raw_materials.getNames(req.params.customer_id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting raw material names for customer ID ${req.params.id}:  ${err.message}`, );
      next(err);
    }
  });

  router.get('/colors', async function(req, res, next) {
    logger.info(`get /raw_materials/colors/`);
    try {
      const response = await raw_materials.getColors();
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting raw material colors:  ${err.message}`, );
      next(err);
    }
  });

  router.get('/quantity_units', async function(req, res, next) {
    logger.info(`get /raw_materials/quantity_units`);
    try {
      const response = await raw_materials.getQuantityUnitTypes();
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting quantity units: ${err.message}`);
      next(err);
    }
  });

  // PUT -> save (create/update) raw material
  /*
    curl -i \
        -X PUT \
        -H 'Accept: application/json' \
        -H 'Content-type: application/json' \
        --data "{  \"name\":\"Alon's\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"updated_by\": 4 }" \
        http://localhost:3000/raw_materials/12
  */
  router.put('/', async function(req, res, next) {
    logger.info(`pug /raw_materials`);
    try {
      logger.debug(`Body: ${ JSON.stringify(req.body) }`)
      const response = await raw_materials.save_material(req.body);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error saving raw material: ${err.message}`);
      next(err);
    }
  });

/* DELETE raw material */
/*
curl -i -X DELETE \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/raw_materials/10
*/
router.delete('/:id', async function(req, res, next) {
  logger.info(`delete /raw_materials/${req.params.id}`);
  try {
    const response = await raw_materials.remove(req.params.id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error deleting raw material: ${err.message}`);
    next(err);
  }
});

module.exports = router;