const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  });
  
module.exports = mongoose.model("Address",addressSchema)