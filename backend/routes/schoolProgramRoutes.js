const express = require('express');
const router = express.Router();
const {
  createSchoolProgram,
  getSchoolPrograms,
  getSchoolProgramById,
  updateSchoolProgram,
  deleteSchoolProgram
} = require('../controllers/schoolProgramController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getSchoolPrograms);
router.get('/:id', getSchoolProgramById);

// Admin routes (protected)
router.post('/', protect, admin, createSchoolProgram);
router.put('/:id', protect, admin, updateSchoolProgram);
router.delete('/:id', protect, admin, deleteSchoolProgram);

module.exports = router;
