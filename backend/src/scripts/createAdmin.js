/**
 * Script to create an admin user
 * Usage: node src/scripts/createAdmin.js <email> <password> <name>
 * Example: node src/scripts/createAdmin.js admin@example.com admin123 "Admin User"
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to database
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables');
      console.log('💡 Make sure you have a .env file in the backend folder with MONGO_URI set');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Get arguments
    const email = process.argv[2] || 'admin@infinity.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('✅ Admin user already exists with this email!');
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Role: ${existingAdmin.role}`);
        await mongoose.connection.close();
        process.exit(0);
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Existing user promoted to admin!');
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Role: ${existingAdmin.role}`);
        console.log('\n📝 You can now login with these credentials:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: [Your existing password]`);
        console.log('\n🔗 Admin Dashboard: http://localhost:3000/admin');
        await mongoose.connection.close();
        process.exit(0);
      }
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}`);
    console.log('\n📝 You can now login with these credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Admin Dashboard: http://localhost:3000/admin');

    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error('💡 This email is already in use. Try a different email or update the existing user.');
    }
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

createAdmin();

