const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();
app.use(cors());

const port = 3000;
const rawMaterialsRouter = require("./routes/raw_materials");
const babiesRouter = require("./routes/babies");
const currenciesRouter = require("./routes/currencies");
const countriessRouter = require("./routes/countries");
const infoRouter = require("./routes/info");
const wingsRouter = require("./routes/wings");
const hatsRouter = require("./routes/hats");
const customersRouter = require("./routes/customers");
const transaction_historyRouter = require("./routes/transaction_history");
const backupRouter = require("./routes/backup");
const settingsRouter = require("./routes/settings");

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
app.use("/babies", babiesRouter);
app.use("/currencies", currenciesRouter);
app.use("/countries", countriessRouter);
app.use("/info", infoRouter);
app.use("/wings", wingsRouter);
app.use("/hats", hatsRouter);
app.use("/customers", customersRouter);
app.use("/transaction_history", transaction_historyRouter);
app.use("/backup", backupRouter);
app.use("/settings", settingsRouter);

console.log(config.hatsUploadDir);
app.use(config.hats_pictures_path, express.static(config.hatsUploadDir));

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Inventory server listening at http://localhost:${port}`);
});