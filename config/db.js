const mongoose = require("mongoose");

// Loads MongoDB URL from environment variables from .env file
const mongoURI = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using Mongoose.
    await mongoose.connect(mongoURI);
    console.log(`MongoDB is Running!`);

  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
