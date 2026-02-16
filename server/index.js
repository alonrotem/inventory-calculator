const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { logger, end_logger } = require("./logger");
const os = require('os');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const config = require("./config");
//const email= require("./services/email");

const app = express();
let server = null;

app.set('trust proxy', true);
app.use(cookieParser());
app.use(cors({ 
  origin: [
    'http://localhost:4200', 
    'https://localhost:3000', 
    'http://localhost:3000', 
    'https://romtech.duckdns.org'
  ], 
  credentials: true
}));


/*
let addresss = "lajasvjb@sharklasers.com";
let isValid = email.validateAddress(addresss);
console.log("Email " + addresss + " valid status: " + isValid);
*/
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// 1. Serve Angular static files
app.use(config.hats_pictures_path, express.static(config.hatsUploadDir));
app.use(config.user_pictures_path, express.static(config.userUploadDir));
if(os.hostname != config.prod_server_hostname) {
  app.get("/", (req, res) => {
    res.json({ message: "Server is up on port "+ port +"!" });
  });
}
else {
  app.use(express.static(config.angularAppDir));
}

// 2. API routes
app.use("/raw_materials", require("./routes/raw_materials"));
app.use("/currencies", require("./routes/currencies"));
app.use("/countries", require("./routes/countries"));
app.use("/info", require("./routes/info"));
app.use("/wings", require("./routes/wings"));
app.use("/orders", require("./routes/orders"));
app.use("/customers", require("./routes/customers"));
app.use("/transaction_history", require("./routes/transaction_history"));
app.use("/backup", require("./routes/backup"));
app.use("/settings", require("./routes/settings"));
app.use("/systemlogs", require("./routes/systemlogs"));
app.use("/users", require("./routes/users"));

// 3. Catch-all: send Angular index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(config.angularAppDir, 'index.html'));
});

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

process.on('SIGTERM', () => {
  //console.log('SIGTERM signal received.');
  logger.info('SIGTERM signal received.');
  if(server) {
    server.close(async () => {
      console.log('Closed connections. Waiting for files to be released...');
      // Additional cleanup tasks go here
      end_logger();
      await new Promise(resolve => setTimeout(resolve, 5000));
    });
  }
});

process.on('SIGINT', () => {
  //console.log('SIGINT signal received.');
  logger.info('SIGINT signal received.');
  if(server) {
    server.close(async () => {
      console.log('Closed connections. Waiting for files to be released...');
      // Additional cleanup tasks go here
      end_logger();
      await new Promise(resolve => setTimeout(resolve, 5000));
    });
  }
});

process.on('uncaughtException', function (err) {
  logger.error(`CAUGHT UNHANDLED SERVER EXCEPTION: ${err}`);
});

server = app.listen(port, () => {
  logger.info(`=====================================================`);
  logger.info(`Inventory server listening at http://0.0.0.0:${port} Hostname: ${os.hostname}`);
  console.log(`Inventory server listening at http://localhost:${port} Hostname: ${os.hostname}`);
});