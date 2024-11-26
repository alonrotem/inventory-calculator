const express = require('express');
const router = express.Router();
const customers = require('../services/customers');

/* GET customers */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/customers/
*/
router.get('/', async function(req, res, next) {
  try {
      res.json(await customers.getMultiple(req.query.page, req.query.perPage));
  } catch (err) {
    console.error(`Error while getting customers `, err.message);
    next(err);
  }
});

/* GET customer */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/customers/10
*/
router.get('/single/:id', async function(req, res, next) {
    try {
      res.json(await customers.getSingle(req.params.id));
    } catch (err) {
      console.error(`Error while getting customer with ID ${ req.params.id }`, err.message);
      next(err);
    }
  });

  router.get('/names', async function(req, res, next) {
    try {
      res.json(await customers.getNames());
    } catch (err) {
      console.error(`Error while getting customers names `, err.message);
      next(err);
    }
  });

/* POST: create customer */
/*
curl -i -X POST \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
    --data "{  \"name\":\"Test's material\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"created_by\": 2 }" \
        http://localhost:3000/customers/

router.post('/', async function(req, res, next) {
    try {
      res.json(await customers.save(req.body));
    } catch (err) {
      console.error(`Error while creating customer `, err.message);
      next(err);
    }
  });
*/
  // PUT (create/update) customer
  /*
    curl -i \
        -X PUT \
        -H 'Accept: application/json' \
        -H 'Content-type: application/json' \
        --data "{  \"name\":\"Alon's\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"updated_by\": 4 }" \
        http://localhost:3000/babies/12
  */
  router.put('/', async function(req, res, next) {
    try {
      res.json(await customers.save(req.body));
    } catch (err) {
      console.error(`Error while updating customer `, err.message);
      next(err);
    }
  });

/* DELETE baby */
/*
curl -i -X DELETE \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/babies/10
*/
router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await customers.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting customer `, err.message);
      next(err);
    }
  });

module.exports = router;