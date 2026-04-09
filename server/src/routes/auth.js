import { Router } from 'express';
import { signup, login, googleAuth, getMe, updateProfile, changePassword, forgotPassword, resetPassword, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/logout', protect, logout);

export default router;
