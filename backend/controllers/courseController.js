const Course = require('../models/Course');

// Create a new course (Admin only)
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      instructor,
      curriculum,
      duration,
      lessons,
      level,
      instructorBio,
      instructorImage,
      category,
      modules,
    } = req.body;

    const course = new Course({
      title,
      description,
      price,
      image,
      instructor,
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      duration,
      lessons,
      level,
      instructorBio,
      instructorImage,
      category,
      modules: Array.isArray(modules) ? modules : [],
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('-modules.lessons.videoUrl');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      instructor,
      curriculum,
      duration,
      lessons,
      level,
      instructorBio,
      instructorImage,
      category,
      modules,
    } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.image = image || course.image;
    course.instructor = instructor || course.instructor;

    // Update curriculum if provided as an array
    if (Array.isArray(curriculum)) {
      course.curriculum = curriculum;
    }

    // Update modules if provided
    if (Array.isArray(modules)) {
      course.modules = modules;
    }

    if (duration !== undefined) {
      course.duration = duration;
    }
    if (lessons !== undefined) {
      course.lessons = lessons;
    }
    if (level !== undefined) {
      course.level = level;
    }
    if (instructorBio !== undefined) {
      course.instructorBio = instructorBio;
    }
    if (instructorImage !== undefined) {
      course.instructorImage = instructorImage;
    }
    if (category !== undefined) {
      course.category = category;
    }

    await course.save();
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new API endpoint to update modules for a course
const updateCourseModules = async (req, res) => {
  try {
    const { modules } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!Array.isArray(modules)) {
      return res.status(400).json({ message: 'Modules must be an array' });
    }

    course.modules = modules;
    
    // Update total lesson count
    let totalLessons = 0;
    let totalDuration = 0;
    
    modules.forEach(module => {
      if (Array.isArray(module.lessons)) {
        totalLessons += module.lessons.length;
        module.lessons.forEach(lesson => {
          totalDuration += lesson.duration || 0;
        });
      }
    });
    
    course.lessons = totalLessons;
    course.duration = Math.round(totalDuration / 60); // Convert minutes to hours
    
    await course.save();
    res.json({ message: 'Course modules updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload video for a lesson
const uploadLessonVideo = async (req, res) => {
  try {
    // The file will be available as req.file thanks to multer middleware
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { courseId, moduleIndex, lessonIndex } = req.params;
    
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Make sure module exists
    if (!course.modules[moduleIndex]) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Make sure lesson exists
    if (!course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Get the relative path to the uploaded video
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    
    // Update the lesson with the video path
    course.modules[moduleIndex].lessons[lessonIndex].videoUrl = videoUrl;
    
    // Save the course
    await course.save();
    
    res.status(200).json({ 
      message: 'Video uploaded successfully',
      videoUrl: videoUrl,
      lesson: course.modules[moduleIndex].lessons[lessonIndex]
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  updateCourseModules,
  deleteCourse,
  uploadLessonVideo  // Add this
};
