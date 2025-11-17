import { Router } from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getCurrentUser,
  updateProfile,
  changePassword,
  registerValidation,
  loginValidation,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * Public routes (no authentication required)
 */
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refresh);

/**
 * Protected routes (authentication required)
 */
router.get('/me', authenticate, getCurrentUser);
router.patch('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);

export default router;
