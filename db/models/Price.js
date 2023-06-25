const mongoose = require("mongoose");
const pricesSchema = new mongoose.Schema({
    twc: Number,
    bwc: Number,
    wwc: Number,
    oc: Number,
  });


module.exports = new mongoose.model("Price", pricesSchema);