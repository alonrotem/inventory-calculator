const express = require('express');
const router = express.Router();
const info = require('../services/info');


router.get('/stats', async function(req, res, next) {
    try {
      res.json(await info.getInfo());
    } catch (err) {
      console.error(`Error while getInfo `, err.message);
      next(err);
    }
  });

  module.exports = router;