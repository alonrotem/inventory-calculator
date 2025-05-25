const express = require('express');
const router = express.Router();
const countries = require('../services/countries');
const { logger } =  require('../logger');

/* GET countries */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/countries/
*/
router.get('/', async function(req, res, next) {
  logger.info(`get /countries/ page=${req.query.page}, perPage=${req.query.perPage}`);
  try {
    res.json(await countries.getMultiple(req.query.page, req.query.perPage));
  } 
  catch (err) {
    logger.error(`Error getting countries: ${err.message}`);
    next(err);
  }
});

  module.exports = router;