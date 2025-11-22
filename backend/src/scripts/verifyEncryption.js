const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const connectDB = require('../config/db');
const User = require('../models/User');

const verifyEncryption = async () => {
  try {
    await connectDB();

    const testEmail = `test_enc_${Date.now()}@example.com`;
    const testPassword = 'password123';

    console.log(`Creating test user with email: ${testEmail}`);
    console.log(`Original password: ${testPassword}`);

    const user = await User.create({
      name: 'Test Encryption',
      email: testEmail,
      password: testPassword
    });

    // Fetch the user directly from DB to see stored password
    // We need to select +password because it's excluded by default
    const storedUser = await User.findById(user._id).select('+password');

    console.log(`Stored password hash: ${storedUser.password}`);

    const isHashed = storedUser.password && storedUser.password.startsWith('$2a$');
    const isNotPlain = storedUser.password !== testPassword;

    if (isHashed && isNotPlain) {
      console.log('✅ SUCCESS: Password is encrypted (bcrypt hash detected).');
    } else {
      console.error('❌ FAILURE: Password is NOT properly encrypted.');
      console.error(`Is Hashed ($2a$): ${isHashed}`);
      console.error(`Is Not Plain: ${isNotPlain}`);
    }

    // Cleanup
    await User.findByIdAndDelete(user._id);
    console.log('Test user cleaned up.');

    process.exit(0);
  } catch (error) {
    console.error('Error running verification:', error);
    process.exit(1);
  }
};

verifyEncryption();
