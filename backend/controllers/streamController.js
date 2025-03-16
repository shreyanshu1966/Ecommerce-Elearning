const Course = require('../models/Course');
const crypto = require('crypto');

// Generate a unique stream key for a lesson
const generateStreamKey = async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Generate a unique stream key
    const streamKey = crypto.randomBytes(16).toString('hex');
    
    // Update the lesson
    course.modules[moduleIndex].lessons[lessonIndex].isLiveStream = true;
    course.modules[moduleIndex].lessons[lessonIndex].streamKey = streamKey;
    course.modules[moduleIndex].lessons[lessonIndex].streamStatus = 'offline';
    
    await course.save();
    
    res.json({ 
      message: 'Stream key generated successfully',
      streamKey,
      // Let the frontend construct the full URLs with correct ports
      rtmpUrl: `rtmp://${req.get('host').split(':')[0]}:1935/live`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stream status (on-live/offline webhook from Nginx)
const updateStreamStatus = async (req, res) => {
  try {
    console.log('Stream update received:', req.method, req.url);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    
    // Nginx RTMP sends the stream name in the 'name' parameter
    const streamKey = req.body.name || req.query.name;
    
    // Determine if stream is starting or ending
    // If it's a 'publish_done' call type, the stream is ending
    const status = (req.body.call_type === 'publish_done' || req.query.call_type === 'publish_done') 
                  ? 'offline' 
                  : 'live';
    
    console.log(`Stream ${streamKey} status update: ${status}`);
    
    if (!streamKey) {
      console.log('No stream key provided');
      return res.status(200).send('OK');
    }
    
    // Find course with this stream key
    const course = await Course.findOne({
      "modules.lessons.streamKey": streamKey
    });
    
    if (!course) {
      console.log(`No course found with stream key: ${streamKey}`);
      return res.status(200).send('OK'); // Still return OK to avoid Nginx errors
    }
    
    // Find and update the specific lesson
    let updated = false;
    
    for (let i = 0; i < course.modules.length; i++) {
      for (let j = 0; j < course.modules[i].lessons.length; j++) {
        if (course.modules[i].lessons[j].streamKey === streamKey) {
          console.log(`Found lesson in course ${course.title}, module ${i}, lesson ${j}`);
          course.modules[i].lessons[j].streamStatus = status;
          updated = true;
          break;
        }
      }
      if (updated) break;
    }
    
    if (updated) {
      await course.save();
      console.log(`Updated stream status to ${status}`);
    }
    
    // Always return OK to Nginx
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Error in updateStreamStatus:', error);
    // Still return OK to avoid Nginx errors
    return res.status(200).send('OK');
  }
};

// Get stream info for a lesson
const getStreamInfo = async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    
    if (!lesson.isLiveStream) {
      return res.status(400).json({ message: 'This lesson is not configured for live streaming' });
    }
    
    // Just return the stream key, don't construct URLs that might be wrong
    res.json({
      isLiveStream: lesson.isLiveStream,
      streamKey: lesson.streamKey,
      streamStatus: lesson.streamStatus,
      scheduledStartTime: lesson.scheduledStartTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Schedule a live stream
const scheduleStream = async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    const { scheduledStartTime } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    course.modules[moduleIndex].lessons[lessonIndex].scheduledStartTime = new Date(scheduledStartTime);
    await course.save();
    
    res.json({ message: 'Live stream scheduled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manually control stream status
const controlStreamStatus = async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    const { status } = req.body; // status can be 'starting', 'live', 'offline', 'ended'
    
    if (!['starting', 'live', 'offline', 'ended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update the lesson stream status
    course.modules[moduleIndex].lessons[lessonIndex].streamStatus = status;
    await course.save();
    
    return res.status(200).json({ 
      message: 'Stream status updated successfully',
      streamStatus: status
    });
  } catch (error) {
    console.error('Error in controlStreamStatus:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateStreamKey,
  updateStreamStatus,
  getStreamInfo,
  scheduleStream,
  controlStreamStatus // Export the new function
};