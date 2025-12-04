import express from 'express';
import { register, login, refresh, logout, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Защищенные маршруты
router.get('/me', authenticate, me);

export default router;

