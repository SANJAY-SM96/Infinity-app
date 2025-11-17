const SEOContent = require('../models/SEOContent');
const seoAIService = require('../services/seoAIService');

// Get all SEO content
exports.getAllSEOContent = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 100);
    const skip = (page - 1) * limit;
    const { pageType, isActive } = req.query;

    const filter = {};
    if (pageType) filter.pageType = pageType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const [contents, total] = await Promise.all([
      SEOContent.find(filter)
        .skip(skip)
        .limit(limit)
        .sort('-updatedAt')
        .populate('updatedBy', 'name email'),
      SEOContent.countDocuments(filter)
    ]);

    res.json({
      success: true,
      contents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get SEO content by path
exports.getSEOContentByPath = async (req, res, next) => {
  try {
    const { path } = req.params;
    const content = await SEOContent.findOne({ pagePath: path, isActive: true })
      .populate('updatedBy', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'SEO content not found' });
    }

    res.json({
      success: true,
      content
    });
  } catch (error) {
    next(error);
  }
};

// Create SEO content
exports.createSEOContent = async (req, res, next) => {
  try {
    const {
      pageType,
      pagePath,
      pageTitle,
      metaDescription,
      metaKeywords,
      h1,
      h2,
      content,
      structuredData,
      ogTags,
      twitterTags,
      canonicalUrl,
      robots,
      sitemapPriority,
      sitemapChangeFreq
    } = req.body;

    // Check if path already exists
    const existing = await SEOContent.findOne({ pagePath });
    if (existing) {
      return res.status(400).json({ message: 'SEO content for this path already exists' });
    }

    const seoContent = await SEOContent.create({
      pageType,
      pagePath,
      pageTitle,
      metaDescription,
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
      h1,
      h2: Array.isArray(h2) ? h2 : [],
      content,
      structuredData: structuredData || {},
      ogTags: ogTags || {},
      twitterTags: twitterTags || {},
      canonicalUrl,
      robots: robots || 'index, follow',
      sitemapPriority: sitemapPriority || 0.5,
      sitemapChangeFreq: sitemapChangeFreq || 'weekly',
      updatedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'SEO content created successfully',
      content: seoContent
    });
  } catch (error) {
    next(error);
  }
};

// Update SEO content
exports.updateSEOContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.pagePath;
    delete updateData.createdAt;

    updateData.lastUpdated = new Date();
    updateData.updatedBy = req.user._id;

    const content = await SEOContent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('updatedBy', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'SEO content not found' });
    }

    res.json({
      success: true,
      message: 'SEO content updated successfully',
      content
    });
  } catch (error) {
    next(error);
  }
};

// Delete SEO content
exports.deleteSEOContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await SEOContent.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({ message: 'SEO content not found' });
    }

    res.json({
      success: true,
      message: 'SEO content deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Generate SEO content using AI
exports.generateSEOContent = async (req, res, next) => {
  try {
    const { pageType, pagePath, pageTitle, content, keywords = [] } = req.body;

    if (!pageType || !pagePath || !pageTitle || !content) {
      return res.status(400).json({
        message: 'Please provide pageType, pagePath, pageTitle, and content'
      });
    }

    // Generate meta description
    const metaDescription = await seoAIService.generateMetaDescription(
      pageTitle,
      content,
      keywords
    );

    // Generate page title (SEO optimized)
    const seoPageTitle = await seoAIService.generatePageTitle(
      pageTitle,
      pageType,
      keywords
    );

    // Generate keyword suggestions
    const keywordSuggestions = await seoAIService.generateKeywordSuggestions(
      pageTitle,
      pageType,
      keywords
    );

    // Generate structured data
    const structuredData = await seoAIService.generateStructuredData({
      title: seoPageTitle,
      description: metaDescription,
      type: pageType
    });

    res.json({
      success: true,
      generatedContent: {
        pageTitle: seoPageTitle,
        metaDescription,
        metaKeywords: keywordSuggestions,
        structuredData
      }
    });
  } catch (error) {
    console.error('SEO content generation error:', error);
    res.status(500).json({
      message: 'Failed to generate SEO content',
      error: error.message
    });
  }
};

// Bulk update SEO content
exports.bulkUpdateSEOContent = async (req, res, next) => {
  try {
    const { updates } = req.body; // Array of { id, updateData }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of updates' });
    }

    const results = [];
    for (const { id, updateData } of updates) {
      try {
        updateData.lastUpdated = new Date();
        updateData.updatedBy = req.user._id;

        const content = await SEOContent.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );

        if (content) {
          results.push({ id, success: true, content });
        } else {
          results.push({ id, success: false, error: 'Content not found' });
        }
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({
      success: true,
      message: 'Bulk update completed',
      results
    });
  } catch (error) {
    next(error);
  }
};

// Get SEO analytics
exports.getSEOAnalytics = async (req, res, next) => {
  try {
    const [totalPages, activePages, byType, recentUpdates] = await Promise.all([
      SEOContent.countDocuments(),
      SEOContent.countDocuments({ isActive: true }),
      SEOContent.aggregate([
        {
          $group: {
            _id: '$pageType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      SEOContent.find()
        .sort('-lastUpdated')
        .limit(10)
        .select('pagePath pageTitle lastUpdated')
        .populate('updatedBy', 'name')
    ]);

    res.json({
      success: true,
      analytics: {
        totalPages,
        activePages,
        inactivePages: totalPages - activePages,
        byType,
        recentUpdates
      }
    });
  } catch (error) {
    next(error);
  }
};

