import express from 'express';
import { login, getProfile, changePassword, createUser } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateLogin, validateUser } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, changePassword);

// Admin only routes
router.post('/users', authenticateToken, requireAdmin, validateUser, createUser);

export default router;