const express = require('express');
const router = express.Router();
const backup = require('../services/backup');
const helper = require('../helper');

/* GET babies */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/babies/
*/
//http://localhost:3000/backup/?filename=hello-world&keep_existing_records=true
router.get('/', async function(req, res, next) {
  try {
    console.dir(req.query);
    let backup_file_name = (req.query.filename)? req.query.filename : helper.dateStr(new Date()) + "-db-backup.sql";
    if(!backup_file_name.endsWith(".sql")){
      backup_file_name += ".sql";
    }
    let keep_existing_records = (req.query.keep_existing_records)? true : false;

    let inserts = await backup.get_backup(keep_existing_records);

    res.setHeader('Content-disposition', 'attachment; filename=' + backup_file_name);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write(inserts);
    res.end();

    //res.json(await backup.get_backup(req, res));
  } catch (err) {
    console.error(`creating backup `, err.message);
    next(err);
  }
});

module.exports = router;