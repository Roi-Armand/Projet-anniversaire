import express from 'express';
import { register, login, verifyEmail, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../middleware/validation.middleware.js';

const router = express.Router();

// Register a new user
router.post('/register', validateRegister, register);

// Login user
router.post('/login', validateLogin, login);

// Verify email
router.get('/verify-email/:token', verifyEmail);

// Get current user (protected route)
router.get('/me', authenticate, getCurrentUser);

export default router;

