const express = require('express');
const {
  getBlogs,
  getBlogBySlug,
  getCategories,
  getTags,
  createBlog,
  updateBlog,
  deleteBlog,
  generateBlog,
  getAllBlogs,
  generateStructuredData
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes - specific routes first
router.get('/', getBlogs);
router.get('/categories', getCategories);
router.get('/tags', getTags);

// Admin routes - specific routes before parameterized routes
router.post('/', protect, admin, createBlog);
router.post('/generate', protect, admin, generateBlog);
router.get('/admin/all', protect, admin, getAllBlogs);

// Admin routes with parameters
router.post('/:id/structured-data', protect, admin, generateStructuredData);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

// Public route with parameter - MUST be last
router.get('/:slug', getBlogBySlug);

module.exports = router;

