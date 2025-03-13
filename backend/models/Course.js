const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    lessons: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: Number, // duration in hours
      required: true,
      default: 0,
    },
    features: [String],
    requirements: [String],
    curriculum: [
      {
        section: String,
        lectures: [
          {
            title: String,
            duration: String,
            videoUrl: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
