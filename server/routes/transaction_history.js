const express = require('express');
const router = express.Router();
const transaction_history = require('../services/transaction_history');
const { logger } =  require('../logger');
const { auth_request } = require('../middleware/auth_request');

// The history is written by the server, when the material changes (see services/transaction_history.js).
// There is no route to add records.

// The movements of a raw material, a purchase, a customer bank or an allocation
// kind: raw_material | purchase | bank | allocation
router.get('/flow/:kind/:id',
  auth_request([{requiredArea:'raw_materials', requiredPermission:'R'}]),
  async function(req, res, next) {
    logger.info(`get /transaction_history/flow/${req.params.kind}/${req.params.id}`);
    try {
      const response = await transaction_history.get_flow(req.params.kind, req.params.id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    }
    catch (err) {
      logger.error(`Error getting the history of ${req.params.kind} ${req.params.id}: ${err.message}`);
      next(err);
    }
  });

// kept for the existing clients: the same as /flow/raw_material/:id and /flow/bank/:id
router.get('/raw_material/:id',
  auth_request([{requiredArea:'raw_materials', requiredPermission:'R'}]),
  async function(req, res, next) {
    logger.info(`get /transaction_history/raw_material/${req.params.id}`);
    try {
      res.json(await transaction_history.get_flow('raw_material', req.params.id));
    }
    catch (err) {
      logger.error(`Error getting transaction history records for raw material with ID ${req.params.id}: ${err.message}`);
      next(err);
    }
  });

router.get('/customer_bank/:id',
  auth_request([{requiredArea:'raw_materials', requiredPermission:'R'}]),
  async function(req, res, next) {
    logger.info(`get /transaction_history/customer_bank/${req.params.id}`);
    try {
      res.json(await transaction_history.get_flow('bank', req.params.id));
    }
    catch (err) {
      logger.error(`Error getting transaction records for customer bank id ${req.params.id}: ${err.message}`);
      next(err);
    }
  });

router.get('/raw_quantity_history/:quantity_units',
  auth_request([{requiredArea:'raw_materials', requiredPermission:'R'}]),
  async function(req, res, next) {
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
    logger.error(`Error while getting enum values: ${err.message}`);
    next(err);
  }
});

module.exports = router;
