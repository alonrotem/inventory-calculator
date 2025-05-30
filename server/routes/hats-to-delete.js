const express = require('express');
const router = express.Router();
const hats = require('../services/hats');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
//const config = require('../config');

/*
// Ensure 'uploads' directory exists
const hatsUploadDir = path.join(path.resolve('.'), 'uploads/images/hats/');
if (!fs.existsSync(hatsUploadDir)) {
    fs.mkdirSync(hatsUploadDir, { recursive: true });
}
*/

// Configure Multer to store file in memory (not using diskStorage)
const upload = multer({ storage: multer.memoryStorage() });


/* GET babies */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/hats/
*/
router.get('/', async function(req, res, next) {
  try {
      res.json(await hats.getMultiple(req.query.page, req.query.perPage));
  } catch (err) {
    console.error(`Error while getting hats `, err.message);
    next(err);
  }
});

router.get('/names', async function(req, res, next) {
  try {
      res.json(await hats.geHatNames());
  } catch (err) {
    console.error(`Error while getting hat names `, err.message);
    next(err);
  }
});

router.get('/basic', async function(req, res, next) {
  try {
      res.json(await hats.geHatBasicInfo());
  } catch (err) {
    console.error(`Error while getting hat basic info `, err.message);
    next(err);
  }
});

/* GET baby */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/hats/10
*/
router.get('/single/:id', async function(req, res, next) {
    try {
      res.json(await hats.getSingle(req.params.id));
    } catch (err) {
      console.error(`Error while getting hat with ID ${ req.params.id }`, err.message);
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
/*
router.post('/', async function(req, res, next) {
    try {
      res.json(await hats.create(req.body));
    } catch (err) {
      console.error(`Error while creating hat `, err.message);
      next(err);
    }
  });*/

  // PUT (create/update) baby
  /*
    curl -i \
        -X PUT \
        -H 'Accept: application/json' \
        -H 'Content-type: application/json' \
        --data "{  \"name\":\"Alon's\",  \"purchased_at\": \"2024-05-01\", \"weight\": 100, \"updated_by\": 4 }" \
        http://localhost:3000/babies/12
  */
 /*
  router.put('/', upload.single('photo'), async function(req, res, next) {
    try {
      const hatData = JSON.parse(req.body.data);
      const hatPhoto = (req.file)? req.file : null;

      res.json(await hats.save(hatData, hatPhoto));
    } catch (err) {
      console.error(`Error while updating hat `, err.message);
      next(err);
    }
  });
  */
  router.put('/', async function(req, res, next) {
    console.log("saving hat");
    try {
      //const hatData = JSON.parse(req.body.data);

      //const hatPhoto = (req.file)? req.file : null;

      res.json(await hats.save(req.body/*, hatPhoto*/));
    } catch (err) {
      console.error(`Error while saving hat `, err.message);
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
      res.json(await hats.remove(req.params.id));
    } catch (err) {
      console.error(`Error while hat baby `, err.message);
      next(err);
    }
  });

module.exports = router;