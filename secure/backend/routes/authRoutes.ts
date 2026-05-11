import express from 'express';
import { signup, login, verifyOTP, refreshToken, logout } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
