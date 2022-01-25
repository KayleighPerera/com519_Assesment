require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const path = require("path");
const app = express();
const port = 2020;
const mongoose = require("mongoose");
app.set("view engine", "ejs");
var bodyParser = require('body-parser')
const { MONGODB_URI, MONGODB_PRODUCTION_URI } = process.env;
const fs = require("fs").promises;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const client = new MongoClient(
  process.env.NODE_ENV === "production" ? MONGODB_PRODUCTION_URI : MONGODB_URI);



const driverController = require("./controllers/driver");
const loading = require("loading-cli");

app.use(express.static(path.join(__dirname, "public")));



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

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.post("/create-driver", driverController.create);

app.get("/drivers/delete/:id", driverController.delete);

app.get("/drivers/update/:id", driverController.edit);
app.post("/drivers/update/:id", driverController.update);

app.get("/login", (req, res) => {
  res.render("login");
});


// //Loading in the data from drivers.json (contains an error) but dataset still loaded in
// async function main() {
//   try {
//     await client.connect();
//     const db = client.db();
//     const results = await db.collection("drivers").find({}).count();

//     /**
//      * If existing records then delete the current collections
//      */
//     if (results) {
//       console.info("deleting collection");
//       await db.collection("drivers").drop();
//     }

//     /**
//      * This is just a fun little loader module that displays a spinner
//      * to the command line
//      */
//     const load = loading("importing your drivers").start();

//     /**
//      * Import the JSON data into the database
//      */

//     const data = await fs.readFile(path.join(__dirname, "drivers.json"), "utf8");
//     await db.collection("drivers").insertMany(JSON.parse(data));

//     /**
//      * This perhaps appears a little more complex than it is. Below, we are
//      * grouping the drivers. Finally, we tidy up the output so it represents the format we need for our new collection
//      */

//     const driversRef = await db.collection("drivers").aggregate([
//       { $match: { driver_name: { $ne: null } } },
//       {
//         $group: {
//           _id: "$_id",
//           name: { "$first": "$name" },
//           number: { $sum: 1 },
//           team: { "$first": "$driver_team" },
//           year: { $sum: 1 },
//         },
//       },
//       { $set: { name: "$driver_name", _id: "$_id" } },
//     ]);
//     /**
//      * Below, we output the results of our aggregate into a
//      * new collection
//      */
//     const drivers = await driversRef.toArray();
//     await db.collection("drivers").insertMany(drivers);

//     /** Our final data manipulation is to reference each document in the
//      * tastings collection to a taster id
//      */

//     const updateddriversRef = db.collection("drivers").find({});
//     const updateddrivers = await updateddriversRef.toArray();
//     updateddrivers.forEach(async ({ _id, name }) => {
//       await db.collection("drivers").updateMany({ driver_name: name }, [
//         {
//           $set: {
//             driver_id: _id,
//             name: "$driver_name",
//             number: "$driver_number",
//             team: "$driver_team",
//             year: { $count: "$driver_year" },
//           },
//         },
//       ]);

//       /**
//        * we can get rid of region_1/2 off our root document, since we've
//        * placed them in an array
//        */
//       await db
//         .collection("drivers")
//         .updateMany({}, { $unset: { driver_1: "", driver_2: " " } });

//       /**
//        * Finally, we remove nulls regions from our collection of arrays
//        * */
//       await db
//         .collection("drivers")
//         .updateMany({ drivers: { $all: [null] } }, [
//           { $set: { drivers: [{ $arrayElemAt: ["$driver_name", 0] }] } },
//         ]);
//       load.stop();
//       console.info(
//         `drivers collection set up! `
//       );
//       process.exit();
//     });
//   } catch (error) {
//     console.error("error:", error);
//     process.exit();
//   }
// }


// main();





