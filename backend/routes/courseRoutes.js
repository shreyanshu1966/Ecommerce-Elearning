const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse,
  updateCourseModules,
  uploadLessonVideo
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Admin Routes (Protected)
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.put('/:id/modules', protect, admin, updateCourseModules);
router.delete('/:id', protect, admin, deleteCourse);

// Video upload route
router.post(
  '/:courseId/modules/:moduleIndex/lessons/:lessonIndex/upload-video',
  protect,
  admin,
  upload.single('video'),
  uploadLessonVideo
);

module.exports = router;
