const express = require('express');
const router = express.Router();
const settings = require('../services/settings');


  //using post in order to receive a list of keys to get (optional)
  /*
  (in git bash shell)

  # Get all settings
  curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' http://localhost:3000/settings/

  # Get SOME settings
  curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' http://localhost:3000/settings/ --data "[\"alert_raw_material_total_kg\",\"alert_raw_material_total_units_below\"]"
  */
  router.post('/', async function(req, res, next) {
    try {
      res.json(await settings.getSettings(req.body));
    } catch (err) {
      console.error(`Error while getting(post) settings `, err.message);
      next(err);
    }
  });

  module.exports = router;