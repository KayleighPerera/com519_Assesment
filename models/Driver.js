const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverSchema = new Schema(
  {
    Driver: String,
    PTS: { type: Number, default: 0 },
    Car: String,
    Year: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);