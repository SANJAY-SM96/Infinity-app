import api from './apiClient';

export const seoAIService = {
  // Check AI availability
  checkAvailability: async () => {
    const response = await api.get('/ai/seo/availability');
    return response.data;
  },

  // Generate meta description
  generateMetaDescription: async (productTitle, productDescription, keywords = []) => {
    const response = await api.post('/ai/seo/meta-description', {
      productTitle,
      productDescription,
      keywords
    });
    return response.data;
  },

  // Generate page title
  generatePageTitle: async (productTitle, category, keywords = []) => {
    const response = await api.post('/ai/seo/page-title', {
      productTitle,
      category,
      keywords
    });
    return response.data;
  },

  // Generate product description
  generateProductDescription: async (productTitle, techStack = [], features = [], category) => {
    const response = await api.post('/ai/seo/product-description', {
      productTitle,
      techStack,
      features,
      category
    });
    return response.data;
  },

  // Generate keyword suggestions
  generateKeywordSuggestions: async (productTitle, category, techStack = []) => {
    const response = await api.post('/ai/seo/keywords', {
      productTitle,
      category,
      techStack
    });
    return response.data;
  },

  // Generate blog post ideas
  generateBlogPostIdeas: async (category, techStack = []) => {
    const response = await api.post('/ai/seo/blog-posts', {
      category,
      techStack
    });
    return response.data;
  },

  // Analyze content for SEO
  analyzeContentSEO: async (content, targetKeywords = []) => {
    const response = await api.post('/ai/seo/analyze-content', {
      content,
      targetKeywords
    });
    return response.data;
  },

  // Generate structured data
  generateStructuredData: async (productData) => {
    const response = await api.post('/ai/seo/structured-data', productData);
    return response.data;
  }
};

