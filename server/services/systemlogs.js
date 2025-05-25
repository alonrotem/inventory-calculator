const express = require('express');
const helper = require('../helper');
const router = express.Router();
const { logger, closeTransports, renew_logger, logFilesPath } =  require('../logger');
const fs = require('fs');
const os = require('os');
const util = require('util');
const path = require('path');
const JSZip = require("jszip");

//const logsFolder = path.join(__dirname, '..' , 'logs');
const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const fstat = util.promisify(fs.fstat);
const close = util.promisify(fs.close);

const getAllLogFilesList = function() {
    const files = [];
    fs.readdirSync(logFilesPath).map(file => {

        const absolutePath = path.join(logFilesPath, file);
        const stats = fs.statSync(absolutePath);
        if (!fs.statSync(absolutePath).isDirectory() && !file.startsWith(".") && !file.endsWith(".delete-pending") && stats.size > 0) {
            const fileItem = {
                filename: file,
                size: stats.size,
                date: stats.mtime
            };
            return files.push(fileItem);
        }
    });
    return files;
}

const getAllFilesZipped = async function (){
    const zip = new JSZip();
    const fileList = fs.readdirSync(logFilesPath);
    let files_to_send = 0;
    fileList.filter(f => !f.startsWith(".") && !f.endsWith(".delete-pending")).forEach((file) => {
        const filePath = path.join(logFilesPath, file);
        if (!fs.statSync(filePath).isDirectory() && !file.startsWith(".")) {
            try {
                const fileData = fs.readFileSync(filePath); // Read binary file
                zip.file(file, fileData); // Add to ZIP
                files_to_send++;
            } 
            catch (err) {
                console.error(`Error reading ${file}:`, err);
            }
        }
    });
    if(files_to_send > 0) {
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
        return zipBuffer;
    }
    else {
        return null;
    }
}

const deleteAllLogs = function (){
    let files = fs.readdirSync(logFilesPath);
    //closeTransports();
    
    //Deleting the files is problematic as the files are locked. 
    //But their content is available to be changed (options when the transport is created),
    //so the easier way is to clear the content
    for (const file of files.filter(f => !f.startsWith(".") && !f.endsWith(".delete-pending")) ) {
        const filePath = path.join(logFilesPath, file);
        fs.truncateSync(filePath, 0, function(){console.log(`Cleared log ${file}`)});
        /*
        
        fs.renameSync(filePath, filePath + ".delete-pending");
        //fs.unlinkSync(filePath  + ".delete-pending");
        fs.rmSync(filePath, { force: true, maxRetries: 5, retryDelay: 100 });
        */
    }
    //renew_logger();
}

const deleteLog = function(filePath){
    fs.truncateSync(filePath, 0, function(){console.log(`Cleared log ${file}`)});
}

async function readLastLines(filepath, maxLines = 100) {
    const CHUNK_SIZE = 8192;
    const fd = await open(filepath, 'r');
  
    try {
      const stats = await fstat(fd);
      let position = stats.size;
      let lines = [];
      let leftover = '';
      const buffer = Buffer.alloc(CHUNK_SIZE);
  
      while (position > 0 && lines.length < maxLines) {
        const toRead = Math.min(CHUNK_SIZE, position);
        position -= toRead;
  
        const { bytesRead } = await read(fd, buffer, 0, toRead, position);
        const chunk = buffer.slice(0, bytesRead).toString('utf-8');
        const combined = chunk + leftover;
        const parts = combined.split(/\r?\n/);
  
        if (position > 0) {
          leftover = parts.shift(); // may be incomplete
        } else {
          leftover = '';
        }
  
        lines = parts.concat(lines);
      }
  
      return lines.slice(-maxLines); // 👈 return array of strings
    } finally {
      await close(fd);
    }
  }

module.exports = {
    getAllLogFilesList,
    getAllFilesZipped,
    deleteAllLogs,
    deleteLog,
    readLastLines
}