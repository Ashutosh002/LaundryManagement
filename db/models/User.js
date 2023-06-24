const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const customerSchema = new mongoose.Schema({
    username: String,
    fname: String,
    lname: String,
    phoneno: Number,
    street: String,
    city: String,
    state: String,
    zipcode: Number,
    recovery: {
      securityquestion: String,
      answer: String
    },
    order: [{
      topwear: String,
      bottomwear: String,
      woolenwear: String,
      other: String,
      quantity: Number,
      pickup: String,
      dropoff: String,
      description: String,
      status: String,
      cost: Number
    }]
  }, {timestamp: true});

customerSchema.plugin(passportLocalMongoose); 


module.exports = new mongoose.model("User", customerSchema);
