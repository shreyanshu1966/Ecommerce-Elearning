const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserPassword,
  getMyCourses
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/my-courses', protect, getMyCourses);  // Make sure this function exists

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);
router.post('/:id/reset-password', protect, admin, resetUserPassword);

module.exports = router;
