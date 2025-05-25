const express = require('express');
const router = express.Router();
const transaction_history = require('../services/transaction_history');
const { logger } =  require('../logger');

/*git bash:
curl -i -X POST  -H 'Accept: application/json' \
 -H 'Content-type: application/json' \
 --data "{  \"id\": 0, \"date\": \"2024-05-01\", \"raw_material_id\": 2, \"customer_id\": 3, \"customer_bank_id\": 8, \"customer_banks_babies_id\": 9, \"quantity\": 90, \"transaction_type\": \"customer_bank_allocate_to_Work\", \"added_by\": 1 }" \
 http://localhost:3000/transaction_history/
*/
router.post('/', async function(req, res, next) {
    try {
      logger.info(`post /transaction_history/`);
      logger.debug(`Body: ${ JSON.stringify(req.body) }`)
      const response = await transaction_history.create_history_record(req.body);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error creating transaction history record: ${err.message}`);
      next(err);
    }
  });

  //get all transaction history records for a raw material
  router.get('/raw_material/:id', async function(req, res, next) {
    logger.info(`get /transaction_history/raw_material/${req.params.id}`);
    try {
      const response = await transaction_history.get_all_raw_maerial_transactions(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting transaction history records for raw material with ID ${req.params.id}: ${err.message}`);
      next(err);
    }
  });

  //get all transaction records for a customer bank
  router.get('/customer_bank/:id', async function(req, res, next) {
    logger.info(`get /transaction_history/customer_bank/${req.params.id}`);
    try {
      const response = await transaction_history.get_all_customer_bank_transactions(req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Erro getting transaction records for customer bank id ${req.params.id}: ${err.message}`);
      next(err);
    }
  });

  router.get('/raw_quantity_history/:quantity_units', async function(req, res, next) {
    logger.info(`get /transaction_history/raw_quantity_history/${req.params.quantity_units}`);
    try {
      const response = await transaction_history.get_raw_materials_quantity_history(req.params.quantity_units);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting raw material history for quantity units ${req.params.quantity_units}: ${err.message}`);
      next(err);
    }
  });

  router.get('/enums', async function(req, res, next) {
    logger.info(`get /transaction_history/enums`);
    try {
      const response = await transaction_history.get_enum_values('transaction_history', 'transaction_type');
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      console.error(`Error while getting enum values: ${err.message}`);
      next(err);
    }
  });

  module.exports = router;