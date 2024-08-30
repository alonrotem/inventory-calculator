const express = require('express');
const router = express.Router();
const raw_materials = require('../services/raw_materials');

/* GET raw materials */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/raw_materials/
*/
router.get('/', async function(req, res, next) {
  try {
    res.json(await raw_materials.getMultiple(req.query.page, req.query.perPage));
  } catch (err) {
    console.error(`Error while getting raw materials `, err.message);
    next(err);
  }
});

/* GET raw material */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/raw_materials/10
*/
router.get('/single/:id', async function(req, res, next) {
    try {
      res.json(await raw_materials.getSingle(req.params.id));
    } catch (err) {
      console.error(`Error while getting raw material with ID ${ req.params.id }`, err.message);
      next(err);
    }
  });

  router.get('/names', async function(req, res, next) {
    try {
      res.json(await raw_materials.getNames());
    } catch (err) {
      console.error(`Error while getting raw material names `, err.message);
      next(err);
    }
  });

/* POST: create raw material */
/*
curl -i -X POST \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
    --data "{  \"name\":\"Test's material\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"created_by\": 2 }" \
        http://localhost:3000/raw_materials/
*/
router.post('/', async function(req, res, next) {
    try {
      res.json(await raw_materials.create(req.body));
    } catch (err) {
      console.error(`Error while creating raw material`, err.message);
      next(err);
    }
  });

  // PUT (update) raw material
  /*
    curl -i \
        -X PUT \
        -H 'Accept: application/json' \
        -H 'Content-type: application/json' \
        --data "{  \"name\":\"Alon's\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"updated_by\": 4 }" \
        http://localhost:3000/raw_materials/12
  */
  router.put('/:id', async function(req, res, next) {
    try {
      res.json(await raw_materials.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating raw material`, err.message);
      next(err);
    }
  });

/* DELETE raw material */
/*
curl -i -X DELETE \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/raw_materials/10
*/
router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await raw_materials.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting raw material`, err.message);
      next(err);
    }
  });

module.exports = router;