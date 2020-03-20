const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI"); // to fetch connection string

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }); // returns promise
    console.log("Mongodb connected....");
  } catch (err) {
    console.error(err.message);
    // exit process if failure occured
    process.exit(1);
  }
};
module.exports = connectDB;
