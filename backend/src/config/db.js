const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose 7.x doesn't require useNewUrlParser and useUnifiedTopology
    // These options are now default and will show deprecation warnings if used
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error(`   Make sure MONGO_URI is set correctly in your .env file`);
    process.exit(1);
  }
};

module.exports = connectDB;
