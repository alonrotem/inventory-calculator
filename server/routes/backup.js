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

// Set up multer for file upload (store in memory or disk)
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({ storage: storage });

router.get('/zip', async function(req, res, next) {
  try {
    let backup_file_name = (req.query.filename)? req.query.filename : helper.dateStr(new Date()) + "-db-backup.zip";
    if(!backup_file_name.endsWith(".zip")){
      backup_file_name += ".zip";
    }
    let keep_existing_records = helper.var_to_bool(req.query.keep_existing_records);
    let inserts = await backup.get_backup(keep_existing_records);

    const zip = new JSZip();
    zip.file('backup.sql', inserts);

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
        console.error(`Error reading ${file}:`, err);
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
    console.error(`creating backup `, err.message);
    next(err);
  }
});


router.post('/', upload.single('file'), async (req, res) => {
  
  
  try {
    const parsedData = JSON.parse(req.body.data);
    const confirm_delete_records = parsedData.conf_del_all;  

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Check if the uploaded file is a ZIP file
    const fileType = req.file.mimetype; // Get the MIME type of the uploaded file
    if (fileType !== 'application/zip' && fileType !== 'application/x-zip-compressed') {
      return res.status(400).json({ message: 'Expecting a backup zip file' });
    }
    //--------------
    try {
      const zip = await JSZip.loadAsync(req.file.buffer); // Load ZIP buffer
      let textFileContent = ""; // To store text file content
      /*
      const outputFolder = config.hatsUploadDir; // Folder for binary files
  
      // Ensure the output folder exists
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }
        */
  
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
        message: "ZIP extracted successfully",
        textContent: textFileContent, // Send text content in response if needed
      });
    } catch (error) {
      console.error("Error extracting ZIP:", error);
      res.status(500).json({ error: "Failed to process ZIP file" });
    }
    //--------------
    return;

    let backup_file_content = "";

    // Check if the uploaded file is a ZIP file
    //const fileType = req.file.mimetype; // Get the MIME type of the uploaded file
    if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
      //console.log('Processing ZIP file...');

      // Extract the ZIP file content
      const zip = new JSZip(req.file.buffer, { base64: false, checkCRC32: true });

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
      //await backup.restore_backup(backup_file_content, confirm_delete_records);
    }

    res.status(200).json({ message: 'Backup restored successfully' });
  } 
  catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;