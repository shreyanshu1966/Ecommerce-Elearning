// const mongoose = require('mongoose');

// const schoolProgramSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String, required: true }, // URL for program image
//   createdAt: { type: Date, default: Date.now },
//   // You can add more fields here if needed (e.g. program duration, category, etc.)
// });

// const SchoolProgram = mongoose.model('SchoolProgram', schoolProgramSchema);
// module.exports = SchoolProgram;


const mongoose = require('mongoose');

const schoolProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL for program image
  youtubeLink: { type: String, default: '' }, // NEW: YouTube demo link
  createdAt: { type: Date, default: Date.now },
});

const SchoolProgram = mongoose.model('SchoolProgram', schoolProgramSchema);
module.exports = SchoolProgram;
