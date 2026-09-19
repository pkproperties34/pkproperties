import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './models/Role.js';
import User from './models/User.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Create or find SUPER ADMIN role
    let superAdminRole = await Role.findOne({ name: 'SUPER ADMIN' });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'SUPER ADMIN',
        permissions: ['*'] // Represents all permissions
      });
      console.log('Created SUPER ADMIN role.');
    }

    // Seed SUPER ADMIN user
    const superAdminEmail = 'ssprasanth333@gmail.com';
    let adminUser = await User.findOne({ email: superAdminEmail });
    
    if (!adminUser) {
      const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
      adminUser = await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: password, // Will be hashed by pre-save hook
        role: superAdminRole._id
      });
      console.log(`Created Super Admin user (${superAdminEmail})`);
    } else {
      adminUser.password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
      await adminUser.save();
      console.log(`Updated Super Admin user (${superAdminEmail}) password.`);
    }
    
    console.log('Seeding completed successfully.');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
