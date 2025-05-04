const express = require('express');
const router = express.Router();
const orders = require('../services/orders');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

  router.put('/', async function(req, res, next) {
    console.log("saving order");
    try {
      res.json(await orders.create(req.body));
    } catch (err) {
      console.error(`Error while saving hat `, err.message);
      next(err);
    }
  });

  router.get('/', async function(req, res, next) {
    try {
        res.json(await orders.get_orders_list(req.query.page, req.query.perPage, req.query.customer_id));
    } catch (err) {
      console.error(`Error while getting orders `, err.message);
      next(err);
    }
  });

  module.exports = router;