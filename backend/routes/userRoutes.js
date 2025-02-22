const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get user profile (Protected)
router.get('/profile', protect, getUserProfile);

module.exports = router;
