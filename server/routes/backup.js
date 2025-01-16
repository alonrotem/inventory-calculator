const express = require('express');
const router = express.Router();
const backup = require('../services/backup');
const helper = require('../helper');
const node_zip = require('node-zip');
const multer = require('multer');

// Set up multer for file upload (store in memory or disk)
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({ storage: storage });

/* GET babies */
/* curl -i -X GET \
    -H 'Accept: application/json' \
    -H 'Content-type: application/json' \
        http://localhost:3000/babies/
*/
//http://localhost:3000/backup/?filename=hello-world&keep_existing_records=true
router.get('/', async function(req, res, next) {
  try {
    //console.dir(req.query);
    let backup_file_name = (req.query.filename)? req.query.filename : helper.dateStr(new Date()) + "-db-backup.sql";
    if(!backup_file_name.endsWith(".sql")){
      backup_file_name += ".sql";
    }
    let keep_existing_records = helper.var_to_bool(req.query.keep_existing_records);
    //console.log("keep_existing_records: " + keep_existing_records);

    let inserts = await backup.get_backup(keep_existing_records);

    res.setHeader('Content-disposition', 'attachment; filename=' + backup_file_name);
    res.setHeader('Content-type', 'text/plain');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.charset = 'UTF-8';
    res.write(inserts);
    res.end();
  } 
  catch (err) {
    console.error(`creating backup `, err.message);
    next(err);
  }
});

router.get('/zip', async function(req, res, next) {
  try {
    let backup_file_name = (req.query.filename)? req.query.filename : helper.dateStr(new Date()) + "-db-backup.zip";
    if(!backup_file_name.endsWith(".zip")){
      backup_file_name += ".zip";
    }
    let keep_existing_records = helper.var_to_bool(req.query.keep_existing_records);
    //console.log("keep_existing_records: " + keep_existing_records);

    let inserts = await backup.get_backup(keep_existing_records);

    var zip = new node_zip();
    zip.file('backup.sql', inserts);
    var data = zip.generate({base64:false,compression:'DEFLATE'});

    res.setHeader('Content-disposition', 'attachment; filename=' + backup_file_name);
    res.setHeader('Content-type', 'application/zip');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(Buffer.from(data, 'binary'));
    res.end(); 
  } 
  catch (err) {
    console.error(`creating backup `, err.message);
    next(err);
  }
});



router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const parsedData = JSON.parse(req.body.data);
    const confirm_delete_records = parsedData.conf_del_all;
    let backup_file_content = "";

    // Check if the uploaded file is a ZIP file
    const fileType = req.file.mimetype; // Get the MIME type of the uploaded file
    if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
      //console.log('Processing ZIP file...');

      // Extract the ZIP file content
      const zip = new node_zip(req.file.buffer, { base64: false, checkCRC32: true });

      // Iterate through the files in the ZIP archive
      for (const fileName in zip.files) {
        if (Object.prototype.hasOwnProperty.call(zip.files, fileName)) {
          const file = zip.files[fileName];
          backup_file_content = file.asText(); // Get file content as text
          
        }
      }
    }
    else {
      // Read the file content (text file)
      backup_file_content = req.file.buffer.toString('utf-8'); // Convert buffer to string
    }

    if(backup_file_content) {
      await backup.restore_backup(backup_file_content, confirm_delete_records);
    }

    res.status(200).json({ message: 'Backup restored successfully' });
  } 
  catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;