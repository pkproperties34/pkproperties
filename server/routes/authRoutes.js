import express from 'express';
import { login, getMe, forgotPassword, verifyLoginOtp, resetPasswordWithOtp } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOtp);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password-with-otp', resetPasswordWithOtp);

export default router;
