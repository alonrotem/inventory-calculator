const express = require('express');
const router = express.Router();
const countries = require('../services/countries');

/* GET countries */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/countries/
*/
router.get('/', async function(req, res, next) {
    try {
      res.json(await countries.getMultiple(req.query.page, req.query.perPage));
    } catch (err) {
      console.error(`Error while getting countries `, err.message);
      next(err);
    }
  });

  module.exports = router;