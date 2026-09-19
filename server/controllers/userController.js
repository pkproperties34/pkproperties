import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import crypto from 'crypto';
import { sendOTPEmail } from '../utils/email.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Authenticate user & get token
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('role');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const otp = generateOTP();
    user.loginOtp = hashOTP(otp);
    user.loginOtpExpires = Date.now() + 15 * 60 * 1000;
    
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(user.email, otp, 'Login');

    res.json({
      requiresOtp: true,
      email: user.email,
      message: 'OTP sent to your email.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyUserLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email }).populate('role');
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.loginOtp || !user.loginOtpExpires || user.loginOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired or is invalid. Please login again.' });
    }

    if (user.loginOtp !== hashOTP(otp)) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
      }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Create a new admin user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      permissions: permissions || []
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Delete an admin user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email === 'admin@pkproperties.com') {
      return res.status(403).json({ message: 'Cannot delete the primary Super Admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Update user permissions
export const updateUserPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.permissions = permissions || [];
    await user.save();
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      permissions: user.permissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating permissions', error: error.message });
  }
};
