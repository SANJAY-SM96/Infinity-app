const express = require('express');
const {
  analyzeRequirements,
  getSuggestions,
  chatbot,
  checkAvailability
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// AI routes
router.get('/availability', checkAvailability);
router.post('/analyze', protect, analyzeRequirements);
router.get('/suggestions', getSuggestions);
router.post('/chatbot', chatbot);

module.exports = router;

