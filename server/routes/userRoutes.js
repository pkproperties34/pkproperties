import express from 'express';
import { getUsers, createUser, deleteUser, authUser, verifyUserLoginOtp, updateUserPermissions } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route for admin login
router.post('/login', authUser);
router.post('/verify-login-otp', verifyUserLoginOtp);

// All user management routes require admin access
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUserPermissions);

export default router;
