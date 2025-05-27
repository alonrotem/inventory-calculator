const express = require('express');
const helper = require('../helper');
const router = express.Router();
const { logger, logFilesPath } =  require('../logger');
const fs = require('fs');
const path = require('path');
const JSZip = require("jszip");
const systemlogs = require('../services/systemlogs');

router.get('/', async function(req, res, next) {
    try {
        logger.info(`get /systemlogs/`);
        const files = systemlogs.getAllLogFilesList();
        res.json(files);
    } 
    catch (err) {
      logger.error(`Error getting log files: ${err.message}`);
      next(err);
    }
});

router.get('/getlog/:filename', function(req, res){
    let host = req.headers.host.split(":")[0];
    const filename = req.params.filename;
    const filepath = path.join(logFilesPath, filename);
    const downloadfile = path.parse(filename);
    const downloadfilename = `${downloadfile.name}-${host}${downloadfile.ext}`

    if (fs.existsSync(filepath)) {
        logger.info(`get /getlog/${filename}`);
        res.setHeader('Content-disposition', 'attachment; filename=' + downloadfilename);
        res.setHeader('Content-type', 'text/plain');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filepath, downloadfilename);
    }
    else {
        res.status(404).json({ message: `Log file "${filename}" not found` });
        return;
    }
});

router.get('/getall/', async function(req, res){
    let host = req.headers.host.split(":")[0];
    let logs_archive_file_name = helper.dateStr(new Date()) + `-${host}-logs.zip`;
    const zipBuffer = await systemlogs.getAllFilesZipped();
    if(zipBuffer){
        res.setHeader('Content-disposition', 'attachment; filename=' + logs_archive_file_name);
        res.setHeader('Content-type', 'application/zip');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.send(zipBuffer);
        res.end();
    }
    else {
        res.status(404).json({ message: `No log files found on the server` });
        return;
    }
});

router.get('/getlogtail/:filename', async function(req, res){
    const filename = req.params.filename;
    const filepath = path.join(logFilesPath, req.params.filename);

    if (fs.existsSync(filepath)) {
        const logContent = await systemlogs.readLastLines(filepath, 100);
        res.json(logContent);
    }
    else {
        res.status(404).json({ message: `Log file "${filename}" not found` });
        return;
    }
});

router.delete('/', async function(req, res, next) {
    try {
        systemlogs.deleteAllLogs();
        files = systemlogs.getAllLogFilesList();
        res.json(files);        
    } 
    catch (err) {
      logger.error(`Error deleting log files ${err.message}`);
      res.status(400).json({ message: `Error deleting log files: ${err.message}` });
    }
});

router.delete('/:filename', async function(req, res, next) {
    const filename = req.params.filename;
    const filepath = path.join(logFilesPath, req.params.filename);

    if (fs.existsSync(filepath)) {
        systemlogs.deleteLog(filepath);
        const files = systemlogs.getAllLogFilesList();
        res.json(files);
    }
    else {
        res.status(404).json({ message: `Log file "${filename}" not found` });
        return;
    }
});

module.exports = router;