const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const port = 3000;
const rawMaterialsRouter = require("./routes/raw_materials");
const currenciesRouter = require("./routes/currencies");
const countriessRouter = require("./routes/countries");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "Server is up!" });
});

app.use("/raw_materials", rawMaterialsRouter);
app.use("/currencies", currenciesRouter);
app.use("/countries", countriessRouter);

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