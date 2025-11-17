const aiService = require('../services/aiService');
const ProjectRequest = require('../models/ProjectRequest');

// Analyze project requirements
exports.analyzeRequirements = async (req, res, next) => {
  try {
    const { projectTitle, description, domain, budget, currency } = req.body;

    if (!projectTitle || !description || !domain || !budget) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields: projectTitle, description, domain, budget' 
      });
    }

    // Check if AI is available before attempting to use it
    if (!aiService.isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.',
        error: 'No AI provider configured'
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
      success: false,
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
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a query' 
      });
    }

    // Check if AI is available before attempting to use it
    if (!aiService.isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.',
        error: 'No AI provider configured'
      });
    }

    const suggestions = await aiService.getProjectSuggestions(query);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ 
      success: false,
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
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a message' 
      });
    }

    // Check if AI is available before attempting to use it
    if (!aiService.isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.',
        error: 'No AI provider configured'
      });
    }

    const response = await aiService.getChatbotResponse(message, conversationHistory);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ CHATBOT ERROR');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    console.error('═══════════════════════════════════════════════════════════');
    
    // Return detailed error in development, generic in production
    const errorResponse = {
      success: false,
      message: 'Failed to get chatbot response',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while processing your request'
    };
    
    // In development, include more details
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        name: error.name,
        message: error.message,
        // Don't include full stack in response for security
      };
    }
    
    res.status(500).json(errorResponse);
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
      success: false,
      message: 'Failed to check AI availability',
      error: error.message 
    });
  }
};

// Get project ideas
exports.getProjectIdeas = async (req, res, next) => {
  try {
    const { interests, budget, techStack } = req.body;

    if (!interests) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide interests' 
      });
    }

    // Check if AI is available before attempting to use it
    if (!aiService.isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.',
        error: 'No AI provider configured'
      });
    }

    const techStackArray = Array.isArray(techStack) ? techStack : (techStack ? [techStack] : []);
    const ideas = await aiService.getProjectIdeas(interests, budget, techStackArray);

    res.json({
      success: true,
      ideas
    });
  } catch (error) {
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ PROJECT IDEAS ERROR');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    console.error('═══════════════════════════════════════════════════════════');

    // Return detailed error in development, generic in production
    const errorResponse = {
      success: false,
      message: 'Failed to get project ideas',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while processing your request'
    };

    // In development, include more details
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        name: error.name,
        message: error.message,
      };
    }

    // Use appropriate status code based on error type
    let statusCode = 500;
    if (error.message?.includes('overloaded') || error.message?.includes('503')) {
      statusCode = 503;
    } else if (error.message?.includes('quota') || error.message?.includes('429')) {
      statusCode = 429;
    } else if (error.message?.includes('API_KEY') || error.message?.includes('not configured')) {
      statusCode = 503;
    }

    res.status(statusCode).json(errorResponse);
  }
};

// Recommend projects
exports.recommendProjects = async (req, res, next) => {
  try {
    const { experienceLevel, interests, skills, goals, budget, timeline } = req.body;

    // Check if AI is available before attempting to use it
    if (!aiService.isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.',
        error: 'No AI provider configured'
      });
    }

    const userProfile = {
      experienceLevel,
      interests,
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      goals,
      budget,
      timeline
    };

    const recommendations = await aiService.recommendProjects(userProfile);

    res.json({
      success: true,
      ...recommendations
    });
  } catch (error) {
    console.error('Project recommendation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get project recommendations',
      error: error.message 
    });
  }
};

// Explain project functionality
exports.explainFunctionality = async (req, res, next) => {
  try {
    const { projectTitle, projectDescription, features } = req.body;

    if (!projectTitle || !projectDescription) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide projectTitle and projectDescription' 
      });
    }

    // Check if AI is available before attempting to use it
    if (!aiService.isAIAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.',
        error: 'No AI provider configured'
      });
    }

    const featuresArray = Array.isArray(features) ? features : (features ? [features] : []);
    const explanation = await aiService.explainProjectFunctionality(
      projectTitle,
      projectDescription,
      featuresArray
    );

    res.json({
      success: true,
      explanation
    });
  } catch (error) {
    console.error('Functionality explanation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to explain project functionality',
      error: error.message 
    });
  }
};

