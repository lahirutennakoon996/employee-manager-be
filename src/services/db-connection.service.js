require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Create database connection to mongo db
 * @returns {Promise<void>}
 */
module.exports.createDBConnection = async () => {
  try {
    await mongoose.connect(`mongodb:${process.env.DATABASE}`);
    mongoose.set('debug', JSON.parse(process.env.DATABASE_DEBUG));

    console.log('Connected to mongodb.');
  }
  catch (error) {
    console.error(error);
  }
}