const mongoose = require("mongoose");
const dbName = "ChatApp";

const connectDB = async (url) => {
  try {
    await mongoose.connect(`${url}/${dbName}`);
  } catch (err) {
    console.log("DB connection failed: ", err);
  }
};

module.exports = connectDB;
