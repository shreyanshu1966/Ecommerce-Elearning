
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL of course image
  instructor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // "What You'll Learn" (array of bullet points)
  curriculum: {
    type: [String],
    default: [],
  },

  // NEW FIELDS
  duration: { // e.g. "10" hours
    type: Number,
    default: 0,
  },
  lessons: { // e.g. "12" lessons
    type: Number,
    default: 0,
  },
  level: { // e.g. "Beginner", "Intermediate", "Advanced"
    type: String,
    default: 'Beginner',
  },
  instructorBio: { // short bio for instructor
    type: String,
    default: '',
  },
  instructorImage: { // URL for instructor image
    type: String,
    default: '',
  },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
