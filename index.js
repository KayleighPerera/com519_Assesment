require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = 2020;
const mongoose = require("mongoose");
app.set("view engine", "ejs");
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  

const driverController = require("./controllers/driver");

app.use(express.static(path.join(__dirname, "public")));

const { WEB_PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`FormulaOne listening at http://localhost:${port}`);
});

app.get("/drivers", driverController.list);

app.get("/create_driver", (req, res) => {
  res.render("create_driver");
});

app.post("/create-driver", driverController.create);

app.get("/drivers/delete/:id", driverController.delete);

app.get("/drivers/update/:id", driverController.edit);
app.post("/drivers/update/:id", driverController.update);