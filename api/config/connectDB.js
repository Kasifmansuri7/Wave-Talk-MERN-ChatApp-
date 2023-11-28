const mongoose = require("mongoose");
const dbName = "WaveTalk";

const connectDB = async (url) => {
  try {
    const conn = await mongoose.connect(`${url}/${dbName}`);
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.log("DB connection failed: ", err.red);
    process.exit();
  }
};

module.exports = connectDB;
