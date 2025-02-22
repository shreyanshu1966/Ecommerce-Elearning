const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Admin Routes (Protected)
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

module.exports = router;
