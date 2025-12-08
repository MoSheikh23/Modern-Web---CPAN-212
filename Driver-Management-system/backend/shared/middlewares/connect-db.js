const mongoose = require("mongoose");

let isConnected = false;

function connectDb(req, res, next) {
  if (isConnected) {
    return next();
  }

  const uri = process.env.DB_URL;
  if (!uri) {
    console.error("DB_URL missing from .env");
    return next(new Error("Missing DB_URL"));
  }

  mongoose
    .connect(uri)
    .then(() => {
      isConnected = true;
      console.log("MongoDB connected");
      next();
    })
    .catch((err) => {
      console.error("Mongo connection error:", err.message);
      next(err);
    });
}

module.exports = connectDb;
