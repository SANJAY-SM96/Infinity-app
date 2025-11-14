const express = require('express');
const {
  createProjectRequest,
  getAllProjectRequests,
  getProjectRequestById,
  updateProjectRequest,
  deleteProjectRequest,
  getUserProjectRequests
} = require('../controllers/projectRequestController');
const { protect, admin, optional } = require('../middleware/auth');

const router = express.Router();

// Public route - allow anonymous project requests (optional auth)
router.post('/', optional, createProjectRequest);

// Protected routes
router.get('/user', protect, getUserProjectRequests);

// Admin routes
router.get('/', protect, admin, getAllProjectRequests);
router.get('/:id', protect, admin, getProjectRequestById);
router.put('/:id', protect, admin, updateProjectRequest);
router.delete('/:id', protect, admin, deleteProjectRequest);

module.exports = router;

