const mongoose = require("mongoose");
exports.connectDB = async () => {
  try {
    //mongo db connection and dbname provided
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ANCHOR",
    });
    console.log("Date base connected successfully");
  } catch (error) {
    console.log("Error Connecting the database");
  }
};
