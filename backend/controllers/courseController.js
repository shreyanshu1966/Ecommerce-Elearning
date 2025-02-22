const Course = require('../models/Course');

// Create a new course (Admin only)
const createCourse = async (req, res) => {
    try {
        const { title, description, price, image, instructor } = req.body;

        const course = new Course({ title, description, price, image, instructor });
        await course.save();

        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
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
        const { title, description, price, image, instructor } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price || course.price;
        course.image = image || course.image;
        course.instructor = instructor || course.instructor;

        await course.save();
        res.json({ message: 'Course updated successfully', course });
    } catch (error) {
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

module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };
