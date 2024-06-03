const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try{
        mongoose.connect(`${process.env.MONGO_URI}/store`);
        console.log("Connection establised !!!");
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = dbConnect;