const express = require('express');
const router = express.Router();
const { 
  generateStreamKey, 
  updateStreamStatus, 
  getStreamInfo,
  scheduleStream
} = require('../controllers/streamController');
const { protect, admin } = require('../middleware/authMiddleware');

// Generate a stream key (admin only)
router.post('/:courseId/modules/:moduleIndex/lessons/:lessonIndex/generate-key', protect, admin, generateStreamKey);

// Update stream status (webhook from Nginx)
router.post('/update-status', updateStreamStatus);

// Get stream info
router.get('/:courseId/modules/:moduleIndex/lessons/:lessonIndex/info', getStreamInfo);

// Schedule a live stream
router.post('/:courseId/modules/:moduleIndex/lessons/:lessonIndex/schedule', protect, admin, scheduleStream);

module.exports = router;