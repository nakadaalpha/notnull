const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const rateLimit = require('express-rate-limit');

// Rate limiter: Max 10 login/register attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { error: 'Terlalu banyak percobaan, silakan coba lagi setelah 15 menit.' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateProfile);

module.exports = router;
