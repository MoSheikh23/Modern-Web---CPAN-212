const mongoose = require('mongoose');

let isConnected = false;

module.exports = async function connectDb(_req, _res, next) {
  try {
    if (!isConnected) {
      const uri = process.env.DB_URL;
      if (!uri) throw new Error('DB_URL missing from .env');

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, 
      });

      isConnected = true;
      console.log('MongoDB connected');
    }
    next();
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    next(err);
  }
};
