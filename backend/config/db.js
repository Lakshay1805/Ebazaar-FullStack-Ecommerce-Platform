const mongoose = require('mongoose');
require("dotenv").config()


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_ATLAS);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;