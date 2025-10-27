const mongoose = require('mongoose');

const connectDB = async (mongoUri, attempts = 0) => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
