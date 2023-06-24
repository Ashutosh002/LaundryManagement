const mongoose = require("mongoose");
const pricesSchema = new mongoose.Schema({
    topwear: Number,
    bottomwear: Number,
    woolenwear: Number,
    other: Number,
  });


module.exports = new mongoose.model("Price", pricesSchema);