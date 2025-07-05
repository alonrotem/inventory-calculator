const express = require('express');
const router = express.Router();
const settings = require('../services/settings');
const { logger } =  require('../logger');

  //using post in order to receive a list of keys to get (optional)
  /*
  (in git bash shell)

  # Get all settings
  curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' http://localhost:3000/settings/

  # Get SOME settings
  curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' http://localhost:3000/settings/ --data "[\"alert_raw_material_total_kg\",\"alert_raw_material_total_units_below\"]"
  */
  router.post('/', async function(req, res, next) {
    logger.info(`post /settings/`);
    logger.debug(`Body: ${ JSON.stringify(req.body) }`)
    try {
      const response  = await settings.getSettings(req.body);
      logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
      res.json(response);
    } 
    catch (err) {
      logger.error(`Error getting(post) settings: ${err.message}`);
      next(err);
    }
  });

    router.put('/', async function(req, res, next) {
      logger.info(`put /settings`);
      try {
        logger.debug(`Body: ${ JSON.stringify(req.body) }`);
        const response = await settings.saveSettings(req.body);
        logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
        res.json(response);
      } 
      catch (err) {
        logger.error(`Error saving settings: ${err.message}`);
        next(err);
      }
  });


  module.exports = router;