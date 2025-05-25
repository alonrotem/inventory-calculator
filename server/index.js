const express = require("express");
const cors = require("cors");
const config = require("./config");
const { logger, end_logger } = require("./logger");
const os = require('os');

const app = express();
let server = null;
app.use(cors());

const port = 3000;
const rawMaterialsRouter = require("./routes/raw_materials");
const currenciesRouter = require("./routes/currencies");
const countriessRouter = require("./routes/countries");
const infoRouter = require("./routes/info");
const wingsRouter = require("./routes/wings");
//const hatsRouter = require("./routes/hats");
const ordersRouter = require("./routes/orders");
const customersRouter = require("./routes/customers");
const transaction_historyRouter = require("./routes/transaction_history");
const backupRouter = require("./routes/backup");
const settingsRouter = require("./routes/settings");
const systemlogsRouter = require("./routes/systemlogs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "Server is up on port "+ port +"!" });
});

app.use("/raw_materials", rawMaterialsRouter);
app.use("/currencies", currenciesRouter);
app.use("/countries", countriessRouter);
app.use("/info", infoRouter);
app.use("/wings", wingsRouter);
//app.use("/hats", hatsRouter);
app.use("/orders", ordersRouter);
app.use("/customers", customersRouter);
app.use("/transaction_history", transaction_historyRouter);
app.use("/backup", backupRouter);
app.use("/settings", settingsRouter);
app.use("/systemlogs", systemlogsRouter);

console.log(config.hatsUploadDir);
app.use(config.hats_pictures_path, express.static(config.hatsUploadDir));

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
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
  console.log('SIGINT signal received.');
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

server = app.listen(port, () => {
  logger.info(`=====================================================`);
  logger.info(`Inventory server listening at http://0.0.0.0:${port} Hostname: ${os.hostname}`);
  console.log(`Inventory server listening at http://localhost:${port} Hostname: ${os.hostname}`);
});