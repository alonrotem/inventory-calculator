const express = require('express');
const router = express.Router();
const backup = require('../services/backup');
const helper = require('../helper');
//const node_zip = require('node-zip');
const JSZip = require("jszip");
const multer = require('multer');
const config = require('../config');
const path = require('path');
const fs = require("fs");
const { logger } =  require('../logger');

// Set up multer for file upload (store in memory or disk)
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({ storage: storage });

router.get('/zip', async function(req, res, next) {
  try {
    logger.info(`get /backup/zip/filename=${req.query.filename}&keep_existing_records=${req.query.keep_existing_records}`);

    let backup_file_name = (req.query.filename)? req.query.filename : helper.dateStr(new Date()) + "-db-backup.zip";
    if(!backup_file_name.endsWith(".zip")){
      backup_file_name += ".zip";
    }
    let keep_existing_records = helper.var_to_bool(req.query.keep_existing_records);
    let inserts = await backup.get_backup(keep_existing_records);

    const zip = new JSZip();
    zip.file('backup.sql', inserts);
    zip.file('hostname.txt', req.headers.host); //check if we are on prod or dev

    const fileList = fs.readdirSync(config.hatsUploadDir);
    fileList.forEach((file) => {
      const filePath = path.join(config.hatsUploadDir, file);
      const pathInZip = path.join(config.hats_pictures_path, file)
        .replaceAll(path.sep, path.posix.sep)
        .replace(/^\/+/g, '');
  
      try {
        const fileData = fs.readFileSync(filePath); // Read binary file
        zip.file(pathInZip, fileData); // Add to ZIP
      } 
      catch (err) {
        logger.error(`Error reading ${file}: ${err}`);
      }
    });
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader('Content-disposition', 'attachment; filename=' + backup_file_name);
    res.setHeader('Content-type', 'application/zip');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(zipBuffer);
    res.end(); 
  } 
  catch (err) {
    logger.error(`Error creating zipped backup ${err.message}`);
    next(err);
  }
});


router.post('/', upload.single('file'), async (req, res) => {
  logger.info(`post /backup/`);

  try {
    const parsedData = JSON.parse(req.body.data);
    const confirm_delete_records = parsedData.conf_del_all;  

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Check if the uploaded file is a ZIP file
    const fileType = req.file.mimetype; // Get the MIME type of the uploaded file
    if (fileType !== 'application/zip' && fileType !== 'application/x-zip-compressed') {
      logger.error("No zip backup file sent");
      return res.status(400).json({ message: 'Expecting a backup zip file' });
    }
    //--------------
    try {
      const zip = await JSZip.loadAsync(req.file.buffer); // Load ZIP buffer
      let textFileContent = ""; // To store text file content

      // Extract files
      for (const filename of Object.keys(zip.files)) {
        const file = zip.files[filename];
  
        if (file.dir) continue; // Skip directories
  
        if (filename.endsWith(".sql")) {
          textFileContent = await file.async("text");
          if(textFileContent) {
            await backup.restore_backup(textFileContent, confirm_delete_records);
          }
        } 
        else {
          const filePath = path.join(path.resolve('.'), filename);
          let outputDir = "";
          let pathParts = filename.split(path.posix.sep);
          if(pathParts.length > 1){
            pathParts.splice(pathParts.length-1, 1);
            outputDir = path.join(path.resolve('.'), pathParts.join(path.posix.sep));
          }
          if ((outputDir) && !fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
          }
          const fileBuffer = await file.async("nodebuffer");
          fs.writeFileSync(filePath, fileBuffer); // Overwrite if exists
          //console.log(`Extracted binary file: ${filename} -> ${filePath}`);
        }
      }
  
      res.json({
        message: "Backup restored succesfully!",
        textContent: textFileContent, // Send text content in response if needed
      });
    } 
    catch (error) {
      logger.error(`Error restoring backup: ${error}`);
      res.status(500).json({ error: "Error restoring backup!" });
    }
  } 
  catch (error) {
    logger.error(`Error processing file: ${error}`);
    res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;