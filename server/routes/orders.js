const express = require('express');
const router = express.Router();
const orders = require('../services/orders');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logger } =  require('../logger');

  router.put('/', async function(req, res, next) {
    logger.info(`put /orders/`);
    try {
      logger.debug(`Body: ${ JSON.stringify(req.body) }`)
      const response = await orders.create(req.body);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error while saving order ${err.message}`);
      next(err);
    }
  });

  router.get('/', async function(req, res, next) {
     logger.info(`get /orders/ page=${req.query.page}, perPage=${req.query.perPage}, customer_id=${req.query.customer_id}`);
    try {
        const response = await orders.get_orders_list(req.query.page, req.query.perPage, req.query.customer_id);
        logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
        res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting orders: ${err.message}`);
      next(err);
    }
  });

  router.get('/:id', async function(req, res, next) {
      logger.info(`get /orders/${req.params.id}`);
      try {
        const response = await orders.get_order_details(req.params.id);
        logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
        res.json(response);
      } 
      catch (err) {
        logger.error(`Error getting order details with ID ${ req.params.id }: ${err.message}`);
        next(err);
      }
    });

  module.exports = router;