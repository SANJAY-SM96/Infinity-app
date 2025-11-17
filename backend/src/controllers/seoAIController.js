const seoAIService = require('../services/seoAIService');

// Generate meta description
exports.generateMetaDescription = async (req, res, next) => {
  try {
    const { productTitle, productDescription, keywords = [] } = req.body;

    if (!productTitle || !productDescription) {
      return res.status(400).json({ 
        message: 'Please provide productTitle and productDescription' 
      });
    }

    const metaDescription = await seoAIService.generateMetaDescription(
      productTitle,
      productDescription,
      keywords
    );

    res.json({
      success: true,
      metaDescription
    });
  } catch (error) {
    console.error('Meta description generation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Failed to generate meta description',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Generate page title
exports.generatePageTitle = async (req, res, next) => {
  try {
    const { productTitle, category, keywords = [] } = req.body;

    if (!productTitle || !category) {
      return res.status(400).json({ 
        message: 'Please provide productTitle and category' 
      });
    }

    const pageTitle = await seoAIService.generatePageTitle(
      productTitle,
      category,
      keywords
    );

    res.json({
      success: true,
      pageTitle
    });
  } catch (error) {
    console.error('Page title generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate page title',
      error: error.message 
    });
  }
};

// Generate product description
exports.generateProductDescription = async (req, res, next) => {
  try {
    const { productTitle, techStack = [], features = [], category } = req.body;

    if (!productTitle || !category) {
      return res.status(400).json({ 
        message: 'Please provide productTitle and category' 
      });
    }

    const result = await seoAIService.generateProductDescription(
      productTitle,
      techStack,
      features,
      category
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Product description generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate product description',
      error: error.message 
    });
  }
};

// Generate keyword suggestions
exports.generateKeywordSuggestions = async (req, res, next) => {
  try {
    const { productTitle, category, techStack = [] } = req.body;

    if (!productTitle || !category) {
      return res.status(400).json({ 
        message: 'Please provide productTitle and category' 
      });
    }

    const keywords = await seoAIService.generateKeywordSuggestions(
      productTitle,
      category,
      techStack
    );

    res.json({
      success: true,
      keywords
    });
  } catch (error) {
    console.error('Keyword generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate keywords',
      error: error.message 
    });
  }
};

// Generate blog post ideas
exports.generateBlogPostIdeas = async (req, res, next) => {
  try {
    const { category, techStack = [] } = req.body;

    if (!category) {
      return res.status(400).json({ 
        message: 'Please provide category' 
      });
    }

    const blogPosts = await seoAIService.generateBlogPostIdeas(
      category,
      techStack
    );

    res.json({
      success: true,
      ...blogPosts
    });
  } catch (error) {
    console.error('Blog post generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate blog post ideas',
      error: error.message 
    });
  }
};

// Analyze content for SEO
exports.analyzeContentSEO = async (req, res, next) => {
  try {
    const { content, targetKeywords = [] } = req.body;

    if (!content) {
      return res.status(400).json({ 
        message: 'Please provide content to analyze' 
      });
    }

    const analysis = await seoAIService.analyzeContentSEO(
      content,
      targetKeywords
    );

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Content analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze content',
      error: error.message 
    });
  }
};

// Generate structured data for blog
exports.generateBlogStructuredData = async (req, res, next) => {
  try {
    const blogData = req.body;

    if (!blogData || !blogData.title) {
      return res.status(400).json({ 
        message: 'Please provide blog data with at least a title' 
      });
    }

    const structuredData = await seoAIService.generateBlogStructuredData(blogData);

    res.json({
      success: true,
      structuredData
    });
  } catch (error) {
    console.error('Blog structured data generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate blog structured data',
      error: error.message 
    });
  }
};

// Generate structured data
exports.generateStructuredData = async (req, res, next) => {
  try {
    const productData = req.body;

    if (!productData || !productData.title) {
      return res.status(400).json({ 
        message: 'Please provide product data with at least a title' 
      });
    }

    const structuredData = await seoAIService.generateStructuredData(productData);

    res.json({
      success: true,
      structuredData
    });
  } catch (error) {
    console.error('Structured data generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate structured data',
      error: error.message 
    });
  }
};

// Check AI availability
exports.checkAvailability = async (req, res, next) => {
  try {
    const isAvailable = seoAIService.isAIAvailable();
    const provider = seoAIService.getAIProviderName();

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

