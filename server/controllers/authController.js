import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendOTPEmail } from '../utils/email.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password').populate('role');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Generate 2FA OTP
    const otp = generateOTP();
    user.loginOtp = hashOTP(otp);
    user.loginOtpExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save({ validateBeforeSave: false });

    // Send email without awaiting to speed up response
    sendOTPEmail(user.email, otp, 'Login').catch(err => console.error('Background OTP email failed:', err));
    
    res.status(200).json({
      requiresOtp: true,
      email: user.email,
      message: 'OTP sent to your email.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyLoginOtp = async (req, res) => {
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

    // Success!
    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role');
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
      permissions: user.permissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const genericMessage = 'If an account exists with this email, an OTP has been sent.';
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }
    
    const otp = generateOTP();
    user.resetPasswordToken = hashOTP(otp);
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    
    await user.save({ validateBeforeSave: false });
    
    sendOTPEmail(user.email, otp, 'Password Reset').catch(err => console.error('Background OTP email failed:', err));
    
    res.status(200).json({ message: genericMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (!user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired or is invalid.' });
    }

    if (user.resetPasswordToken !== hashOTP(otp)) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
