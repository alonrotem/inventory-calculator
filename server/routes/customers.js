const express = require('express');
const router = express.Router();
const customers = require('../services/customers');
const { logger } =  require('../logger');
const auth_request = require('../middleware/auth_request');

/* GET customers */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/customers/
*/
router.get('/',
  auth_request([{requiredArea:'customers', requiredPermission:'R'}, {requiredArea:'customer_resources_by_customer_id', requiredPermission:'R'}]), 
  async function(req, res, next) {
  try {
    logger.info(`get /customers/ page=${req.query.page}, perPage=${req.query.perPage}`);
    let response = await customers.getMultiple(req.query.page, req.query.perPage, req["auth_token"].id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  } 
  catch (err) {
    logger.error(`Error getting all customers: ${err.message}`);
    if(err.status){
      res.status(err.status).json({message: err.message});
    }
    else {
      next(err);
    }
  }
});

/* GET customer */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/customers/10
*/
router.get('/single/:id', 
  auth_request([{requiredArea:'customers', requiredPermission:'R'}, {requiredArea:'customer_resources_by_customer_id', requiredPermission:'R'}]), 
  async function(req, res, next) {
    try {
      logger.info(`get /customers/single/${req.params.id}`);

      let response = await customers.getSingle(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } catch (err) {
      logger.error(`Error getting customer with ID ${ req.params.id }`, err.message);
      if(err.status){
        res.status(err.status).json({message: err.message});
      }
      else {
        next(err);
      }
    }
  });

  router.get('/names',
    auth_request([{requiredArea:'customers', requiredPermission:'R'}, {requiredArea:'customer_resources_by_customer_id', requiredPermission:'R'}]), 
    async function(req, res, next) {
    try {
      logger.info(`get /customers/names/`);
      let response = await customers.getNames();
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } catch (err) {
      logger.error(`Error getting customers names: ${err.message}`);
      next(err);
      if(err.status){
        res.status(err.status).json({message: err.message});
      }
      else {
        next(err);
      }      
    }
  });

/* POST: create customer */
/*
curl -i -X POST \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
    --data "{  \"name\":\"Test's material\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"created_by\": 2 }" \
        http://localhost:3000/customers/

router.post('/', async function(req, res, next) {
    try {
      res.json(await customers.save(req.body));
    } catch (err) {
      console.error(`Error while creating customer `, err.message);
      next(err);
    }
  });
*/
  // PUT (create/update) customer
  /*
    curl -i \
        -X PUT \
        -H 'Accept: application/json' \
        -H 'Content-type: application/json' \
        --data "{  \"name\":\"Alon's\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"updated_by\": 4 }" \
        http://localhost:3000/babies/12
  */
  router.put('/', 
    auth_request([{requiredArea:'customers', requiredPermission:'U'}, {requiredArea:'customer_resources_by_customer_id', requiredPermission:'U'}]), 
    async function(req, res, next) {
    try {
      logger.info(`put /customers/`);
      logger.debug(JSON.stringify(req.body));

      let response = await customers.save(req.body, req["auth_token"].id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);     
    } catch (err) {
      logger.error(`Error updating customer ${ err.message }`);
      if(err.status){
        res.status(err.status).json({message: err.message});
      }
      else {
        next(err);
      }
    }
  });

/* DELETE baby */
/*
curl -i -X DELETE \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/babies/10
*/
router.delete('/:id', 
  auth_request([{requiredArea:'customers', requiredPermission:'D'}, {requiredArea:'customer_resources_by_customer_id', requiredPermission:'D'}]), 
  async function(req, res, next) {
    try {
      logger.info(`delete /customers/${id}`);
      let response = await customers.remove(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } catch (err) {
      logger.error(`Error deleting customer ${err.message}`);
      if(err.status){
        res.status(err.status).json({message: err.message});
      }
      else {
        next(err);
      }
    }
  });

module.exports = router;