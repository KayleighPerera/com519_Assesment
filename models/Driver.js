const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    name: String,
    number: { type: Number, default: 0 },
    team: String,
    year: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);