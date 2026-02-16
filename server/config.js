const path = require('path');
const fs = require('fs');

//console.log(process.env.SECRET_KEY);

// Ensure 'uploads' directory exists
const hats_pictures_path  = '/uploads/images/hats/';
const user_pictures_path  = '/uploads/images/users/';
const angular_app_path = '/web';
const server_root = __dirname;
const hatsUploadDir = path.join(__dirname, hats_pictures_path);
const userUploadDir = path.join(__dirname, user_pictures_path);
const angularAppDir = path.join(__dirname, angular_app_path);

if (!fs.existsSync(hatsUploadDir)) {
    fs.mkdirSync(hatsUploadDir, { recursive: true });
}
if (!fs.existsSync(userUploadDir)) {
    fs.mkdirSync(userUploadDir, { recursive: true });
}

const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 60000,/*,
      debug: true*/
      multipleStatements: true,
      decimalNumbers: true
    },
    listPerPage: 50,
    server_root: server_root,
    hats_pictures_path: hats_pictures_path,
    user_pictures_path: user_pictures_path,
    hatsUploadDir: hatsUploadDir,
    userUploadDir: userUploadDir,
    angularAppDir: angularAppDir,
    prod_server_hostname: process.env.PROD_SERVER_HOSTNAME,
    registration_code_expiration_horus: 24
  };
  module.exports = config;