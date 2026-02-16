const express = require('express');
const router = express.Router();
const orders = require('../services/orders');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logger } =  require('../logger');
const auth_request = require('../middleware/auth_request');

  router.put('/', 
    auth_request([{requiredArea:'orders', requiredPermission:'R'}, {requiredArea:'orders_resources_by_customer_id', requiredPermission:'R'}]), 
    async function(req, res, next) {
    logger.info(`put /orders/`);
    try {
      logger.debug(`Body: ${ JSON.stringify(req.body) }`)
      const response = await orders.create(req.body, req["auth_token"].id);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error while saving order ${err.message}`);
      next(err);
    }
  });

  router.get('/', 
    auth_request([{requiredArea:'orders', requiredPermission:'R'}, {requiredArea:'orders_resources_by_customer_id', requiredPermission:'R'}]), 
    async function(req, res, next) {
     logger.info(`get /orders/ page=${req.query.page}, perPage=${req.query.perPage}, customer_id=${req.query.customer_id}`);
    try {
        const response = await orders.get_orders_list(req.query.page, req.query.perPage, req.query.customer_id, req["auth_token"].id);
        logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
        res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting orders: ${err.message}`);
      if(err.status){
        res.status(err.status).json(err);
      }
      else {
        next(err);
      }
    }
  });

  router.get('/:id', 
    auth_request([{requiredArea:'orders', requiredPermission:'R'}, {requiredArea:'orders_resources_by_customer_id', requiredPermission:'R'}]), 
    async function(req, res, next) {
      logger.info(`get /orders/${req.params.id}`);
      try {
        const response = await orders.get_order_details(req.params.id, req["auth_token"].id);
        logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
        res.json(response);
      } 
      catch (err) {
        logger.error(`Error getting order details with ID ${ req.params.id }: ${err.message}`);
        if(err.status){
          res.status(err.status).json({message: err.message});
        }
        else {
          next(err);
        }
      }
    });

    router.post('/property', 
      auth_request([{requiredArea:'orders', requiredPermission:'U'}]), 
      async function(req, res, next) {
      logger.info(`post /orders/property`);
      logger.debug(`Body: ${ JSON.stringify(req.body) }`)
      try {
        const response  = await orders.update_order_property(req.body, req["auth_token"].id);
        logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
        res.json(response);
      } 
      catch (err) {
        logger.error(`Error updating order property (post): ${err.message}`);
        if(err.status){
          res.status(err.status).json({message: err.message});
        }
        else {
          next(err);
        }
      }
    });

  module.exports = router;