const mongoose = require("mongoose");

let isConnected = false;

async function connectDb(req, res, next) {
  console.log("CONNECT-DB MIDDLEWARE TRIGGERED");

  if (isConnected) {
    console.log("Mongo already connected");
    return next();
  }

  const uri = process.env.DB_URL;

  if (!uri) {
    console.error("DB_URL missing in environment variables");
    return next(new Error("DB_URL missing"));
  }

  console.log("Connecting to MongoDB with URL:", uri);

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log(" MongoDB connected successfully");
    next();
  } catch (err) {
    console.error("MONGO CONNECTION ERROR:", err);
    next(err);
  }
}

module.exports = connectDb;
