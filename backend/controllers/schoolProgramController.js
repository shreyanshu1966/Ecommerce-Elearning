// const SchoolProgram = require('../models/SchoolProgram');

// // Create a new school program (Admin only)
// const createSchoolProgram = async (req, res) => {
//   try {
//     const { title, description, price, image } = req.body;
//     const program = new SchoolProgram({
//       title,
//       description,
//       price,
//       image,
//     });
//     await program.save();
//     res.status(201).json({ message: 'School Program created successfully', program });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all school programs
// const getSchoolPrograms = async (req, res) => {
//   try {
//     const programs = await SchoolProgram.find();
//     res.json(programs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single school program by ID
// const getSchoolProgramById = async (req, res) => {
//   try {
//     const program = await SchoolProgram.findById(req.params.id);
//     if (!program) {
//       return res.status(404).json({ message: 'School Program not found' });
//     }
//     res.json(program);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a school program (Admin only)
// const updateSchoolProgram = async (req, res) => {
//   try {
//     const { title, description, price, image } = req.body;
//     const program = await SchoolProgram.findById(req.params.id);
//     if (!program) {
//       return res.status(404).json({ message: 'School Program not found' });
//     }
//     program.title = title || program.title;
//     program.description = description || program.description;
//     program.price = price || program.price;
//     program.image = image || program.image;
//     await program.save();
//     res.json({ message: 'School Program updated successfully', program });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a school program (Admin only)
// const deleteSchoolProgram = async (req, res) => {
//   try {
//     const program = await SchoolProgram.findById(req.params.id);
//     if (!program) {
//       return res.status(404).json({ message: 'School Program not found' });
//     }
//     await program.deleteOne();
//     res.json({ message: 'School Program deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createSchoolProgram,
//   getSchoolPrograms,
//   getSchoolProgramById,
//   updateSchoolProgram,
//   deleteSchoolProgram,
// };



const SchoolProgram = require('../models/SchoolProgram');

// Create a new school program (Admin only)
const createSchoolProgram = async (req, res) => {
  try {
    const { title, description, image, youtubeLink } = req.body;
    const program = new SchoolProgram({
      title,
      description,
      image,
      youtubeLink, // NEW FIELD
    });
    await program.save();
    res.status(201).json({ message: 'School Program created successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all school programs
const getSchoolPrograms = async (req, res) => {
  try {
    const programs = await SchoolProgram.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single school program by ID
const getSchoolProgramById = async (req, res) => {
  try {
    const program = await SchoolProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'School Program not found' });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a school program (Admin only)
const updateSchoolProgram = async (req, res) => {
  try {
    const { title, description, image, youtubeLink } = req.body;
    const program = await SchoolProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'School Program not found' });
    }
    program.title = title || program.title;
    program.description = description || program.description;
    program.image = image || program.image;
    if (youtubeLink !== undefined) {
      program.youtubeLink = youtubeLink;
    }
    await program.save();
    res.json({ message: 'School Program updated successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a school program (Admin only)
const deleteSchoolProgram = async (req, res) => {
  try {
    const program = await SchoolProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'School Program not found' });
    }
    await program.deleteOne();
    res.json({ message: 'School Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchoolProgram,
  getSchoolPrograms,
  getSchoolProgramById,
  updateSchoolProgram,
  deleteSchoolProgram,
};
