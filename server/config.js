const path = require('path');
const fs = require('fs');

// Ensure 'uploads' directory exists
const hats_pictures_path  = '/uploads/images/hats/';
const hatsUploadDir = path.join(path.resolve('.'), hats_pictures_path);
if (!fs.existsSync(hatsUploadDir)) {
    fs.mkdirSync(hatsUploadDir, { recursive: true });
}

const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "inventory",
      connectTimeout: 60000,/*,
      debug: true*/
      multipleStatements: true
    },
    listPerPage: 50,
    hats_pictures_path: hats_pictures_path,
    hatsUploadDir: hatsUploadDir
  };
  module.exports = config;