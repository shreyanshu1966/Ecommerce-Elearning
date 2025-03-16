const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  // New fields for live streaming
  isLiveStream: {
    type: Boolean,
    default: false
  },
  streamKey: {
    type: String,
    default: ''
  },
  streamStatus: {
    type: String,
    enum: ['starting', 'live', 'offline', 'ended'],
    default: 'offline'
  },
  scheduledStartTime: {
    type: Date,
    default: null
  }
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  lessons: [lessonSchema]
});

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
    level: {
      type: String,
      default: "Beginner",
    },
    features: [String],
    requirements: [String],
    curriculum: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    instructorBio: {
      type: String,
    },
    instructorImage: {
      type: String,
    },
    modules: [moduleSchema], // Add modules field
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
