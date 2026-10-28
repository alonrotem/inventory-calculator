const express = require('express');
const router = express.Router();
const knives = require('../services/knives');
const { logger } =  require('../logger');
const auth_request = require('../middleware/auth_request');

/* GET knives (names and ids, for lists) */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/knives/?page=1&perPage=20
    with_shape=true adds each knife's drawing (data), e.g. for thumbnails
*/
router.get('/', auth_request([{ requiredArea: 'knives', requiredPermission: 'R' }]), async function(req, res, next) {
  logger.info(`get /knives/ page=${req.query.page}, perPage=${req.query.perPage}, with_shape=${req.query.with_shape}`);
  try {
    const response = await knives.getMultiple(req.query.page, req.query.perPage, req.query.with_shape === 'true');
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  }
  catch (err) {
    logger.error(`Error getting knives ${err.message}`);
    next(err);
  }
});

/* GET knife */
/*
curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/knives/single/10
*/
router.get('/single/:id', auth_request([{ requiredArea: 'knives', requiredPermission: 'R' }]), async function(req, res, next) {
  logger.info(`get /knives/single/${req.params.id}`);
  try {
    const response = await knives.getSingle(req.params.id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  }
  catch (err) {
    logger.error(`Error getting knife with ID ${ req.params.id }: ${err.message}`);
    next(err);
  }
});

// PUT -> save (create/update) knife: creating needs the C permission, updating the U permission
/*
  curl -i \
      -X PUT \
      -H 'Accept: application/json' \
      -H 'Content-type: application/json' \
      --data "{ \"id\": 0, \"name\": \"Knife 1\", \"width_cm\": 10, \"data\": { \"nodes\": [...], \"regions\": {...} } }" \
      http://localhost:3000/knives/
*/
router.put('/', (req, res, next) => {
  const requiredPermission = (req.body?.id > 0)? 'U' : 'C';
  return auth_request([{ requiredArea: 'knives', requiredPermission }])(req, res, next);
}, async function(req, res, next) {
  logger.info(`put /knives`);
  try {
    logger.debug(`Body: ${ JSON.stringify(req.body) }`);
    const response = await knives.save(req.body, req["auth_token"].id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  }
  catch (err) {
    logger.error(`Error saving knife: ${err.message}`);
    next(err);
  }
});

/* DELETE knife */
/*
curl -i -X DELETE \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/knives/10
*/
router.delete('/:id', auth_request([{ requiredArea: 'knives', requiredPermission: 'D' }]), async function(req, res, next) {
  logger.info(`delete /knives/${req.params.id}`);
  try {
    const response = await knives.remove(req.params.id);
    logger.debug(`RESPONSE: ${JSON.stringify(response)}`);
    res.json(response);
  }
  catch (err) {
    logger.error(`Error deleting knife: ${err.message}`);
    next(err);
  }
});

module.exports = router;
