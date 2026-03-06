const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env - check file & syntax");
  }
  console.log("Attempting MongoDB connection...");
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected to: ${conn.connection.host}`);
};

module.exports = connectDB;
