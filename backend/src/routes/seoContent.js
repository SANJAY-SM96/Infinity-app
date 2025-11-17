const express = require('express');
const {
  getAllSEOContent,
  getSEOContentByPath,
  createSEOContent,
  updateSEOContent,
  deleteSEOContent,
  generateSEOContent,
  bulkUpdateSEOContent,
  getSEOAnalytics
} = require('../controllers/seoContentController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.get('/', protect, admin, getAllSEOContent);
router.get('/analytics', protect, admin, getSEOAnalytics);
router.get('/path/:path', getSEOContentByPath); // Public for frontend rendering
router.post('/', protect, admin, createSEOContent);
router.put('/:id', protect, admin, updateSEOContent);
router.delete('/:id', protect, admin, deleteSEOContent);
router.post('/generate', protect, admin, generateSEOContent);
router.post('/bulk-update', protect, admin, bulkUpdateSEOContent);

module.exports = router;

