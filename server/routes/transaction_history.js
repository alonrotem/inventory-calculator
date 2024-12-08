const express = require('express');
const router = express.Router();
const transaction_history = require('../services/transaction_history');

/*git bash:
curl -i -X POST  -H 'Accept: application/json' \
 -H 'Content-type: application/json' \
 --data "{  \"id\": 0, \"date\": \"2024-05-01\", \"raw_material_id\": 2, \"customer_id\": 3, \"customer_bank_id\": 8, \"customer_banks_babies_id\": 9, \"quantity\": 90, \"transaction_type\": \"customer_bank_allocate_to_Work\", \"added_by\": 1 }" \
 http://localhost:3000/transaction_history/
*/
router.post('/', async function(req, res, next) {
    try {
      res.json(await transaction_history.create_history_record(req.body));
    } catch (err) {
      console.error(`Error while creating transaction history record`, err.message);
      next(err);
    }
  });

  router.get('/raw_material/:id', async function(req, res, next) {
    try {
      res.json(await transaction_history.get_all_raw_maerial_transactions(req.params.id));
    } catch (err) {
      console.error(`Error while getting enum values `, err.message);
      next(err);
    }
  });

  router.get('/customer_bank/:id', async function(req, res, next) {
    try {
      res.json(await transaction_history.get_all_customer_bank_transactions(req.params.id));
    } catch (err) {
      console.error(`Error while getting enum values `, err.message);
      next(err);
    }
  });

  router.get('/enums', async function(req, res, next) {
    try {
      res.json(await transaction_history.get_enum_values('transaction_history', 'transaction_type'));
    } catch (err) {
      console.error(`Error while getting enum values `, err.message);
      next(err);
    }
  });

  module.exports = router;