const express = require('express');
const {
  analyzeRequirements,
  getSuggestions,
  chatbot,
  checkAvailability,
  getProjectIdeas,
  recommendProjects,
  explainFunctionality
} = require('../controllers/aiController');
const {
  generateMetaDescription,
  generatePageTitle,
  generateProductDescription,
  generateKeywordSuggestions,
  generateBlogPostIdeas,
  analyzeContentSEO,
  generateStructuredData,
  generateBlogStructuredData,
  checkAvailability: checkSEOAvailability
} = require('../controllers/seoAIController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Log all registered routes in development
if (process.env.NODE_ENV === 'development') {
  console.log('🤖 AI Routes registered:');
  console.log('  GET  /api/ai/availability');
  console.log('  POST /api/ai/analyze (protected)');
  console.log('  GET  /api/ai/suggestions');
  console.log('  POST /api/ai/chatbot');
  console.log('  POST /api/ai/project-ideas');
  console.log('  POST /api/ai/recommend-projects');
  console.log('  POST /api/ai/explain-functionality');
}

// AI routes
router.get('/availability', checkAvailability);
router.post('/analyze', protect, analyzeRequirements);
router.get('/suggestions', getSuggestions);
router.post('/chatbot', chatbot);
router.post('/project-ideas', getProjectIdeas);
router.post('/recommend-projects', recommendProjects);
router.post('/explain-functionality', explainFunctionality);

// SEO AI routes (Admin only)
router.get('/seo/availability', checkSEOAvailability);
router.post('/seo/meta-description', protect, admin, generateMetaDescription);
router.post('/seo/page-title', protect, admin, generatePageTitle);
router.post('/seo/product-description', protect, admin, generateProductDescription);
router.post('/seo/keywords', protect, admin, generateKeywordSuggestions);
router.post('/seo/blog-posts', protect, admin, generateBlogPostIdeas);
router.post('/seo/analyze-content', protect, admin, analyzeContentSEO);
router.post('/seo/structured-data', protect, admin, generateStructuredData);
router.post('/seo/blog-structured-data', protect, admin, generateBlogStructuredData);

module.exports = router;

