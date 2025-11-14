const aiService = require('../services/aiService');
const ProjectRequest = require('../models/ProjectRequest');

// Analyze project requirements
exports.analyzeRequirements = async (req, res, next) => {
  try {
    const { projectTitle, description, domain, budget, currency } = req.body;

    if (!projectTitle || !description || !domain || !budget) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: projectTitle, description, domain, budget' 
      });
    }

    const requirements = {
      projectTitle,
      description,
      domain,
      budget: parseFloat(budget),
      currency: 'INR'
    };

    const analysis = await aiService.analyzeProjectRequirements(requirements);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze requirements',
      error: error.message 
    });
  }
};

// Get project suggestions
exports.getSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a query' });
    }

    const suggestions = await aiService.getProjectSuggestions(query);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ 
      message: 'Failed to get suggestions',
      error: error.message 
    });
  }
};

// Chatbot endpoint
exports.chatbot = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const response = await aiService.getChatbotResponse(message, conversationHistory);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      message: 'Failed to get chatbot response',
      error: error.message 
    });
  }
};

// Check AI availability
exports.checkAvailability = async (req, res, next) => {
  try {
    const isAvailable = aiService.isAIAvailable();
    const provider = aiService.getAIProviderName();

    res.json({
      success: true,
      available: isAvailable,
      provider
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to check AI availability',
      error: error.message 
    });
  }
};

