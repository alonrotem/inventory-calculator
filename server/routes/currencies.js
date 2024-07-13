const express = require('express');
const router = express.Router();
const currencies = require('../services/currencies');

/* GET currencies */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/countries/
*/
router.get('/', async function(req, res, next) {
    try {
      res.json(await currencies.getMultiple(req.query.page, req.query.perPage));
    } catch (err) {
      console.error(`Error while gettingcurrencies `, err.message);
      next(err);
    }
  });

  module.exports = router;