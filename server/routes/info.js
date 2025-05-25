const express = require('express');
const router = express.Router();
const info = require('../services/info');
const { logger } =  require('../logger');

router.get('/stats', async function(req, res, next) {
  logger.info(`get /info/stats`);
    try {
      res.json(await info.getInfo());
    } catch (err) {
      logger.error(`Error when fetching getInfo: ${err.message}`, );
      next(err);
    }
  });

  module.exports = router;