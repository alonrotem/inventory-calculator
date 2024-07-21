const express = require('express');
const router = express.Router();
const babies = require('../services/babies');

/* GET babies */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/babies/
*/
router.get('/', async function(req, res, next) {
  try {
    let material_id = req.query.raw_material_id;
    if(material_id && !isNaN(material_id) && parseInt(material_id) > 0) {
      res.json(await babies.getMultipleByRawMaterial(material_id, req.query.page, req.query.perPage));
    }
    else {
      res.json(await babies.getMultiple(req.query.page, req.query.perPage));
    }
  } catch (err) {
    console.error(`Error while getting babies `, err.message);
    next(err);
  }
});

/* GET baby */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/babies/10
*/
router.get('/:id', async function(req, res, next) {
    try {
      res.json(await babies.getSingle(req.params.id));
    } catch (err) {
      console.error(`Error while getting baby with ID ${ req.params.id }`, err.message);
      next(err);
    }
  });

/* POST: create baby */
/*
curl -i -X POST \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
    --data "{  \"name\":\"Test's material\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"created_by\": 2 }" \
        http://localhost:3000/babies/
*/
router.post('/', async function(req, res, next) {
    try {
      res.json(await babies.create(req.body));
    } catch (err) {
      console.error(`Error while creating baby `, err.message);
      next(err);
    }
  });

  // PUT (update) baby
  /*
    curl -i \
        -X PUT \
        -H 'Accept: application/json' \
        -H 'Content-type: application/json' \
        --data "{  \"name\":\"Alon's\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"updated_by\": 4 }" \
        http://localhost:3000/babies/12
  */
  router.put('/:id', async function(req, res, next) {
    try {
      res.json(await babies.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating baby `, err.message);
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
      res.json(await babies.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting baby `, err.message);
      next(err);
    }
  });

module.exports = router;