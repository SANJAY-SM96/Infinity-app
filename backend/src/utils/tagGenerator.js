/**
 * Comprehensive Tag Generation System
 * Auto-generates tags based on title, description, tech stack, category, intent, industry, and format
 */

// Stop words to remove from tags
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
  'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their',
  'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her',
  'would', 'make', 'like', 'into', 'him', 'time', 'has', 'look', 'two',
  'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could', 'people',
  'my', 'than', 'first', 'been', 'call', 'who', 'oil', 'sit', 'now', 'find',
  'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'with', 'project',
  'projects', 'code', 'source', 'download', 'buy'
]);

// Technology keywords mapping
const TECH_KEYWORDS = {
  'react': ['react', 'reactjs', 'react.js', 'jsx', 'hooks', 'redux', 'next.js', 'nextjs'],
  'python': ['python', 'django', 'flask', 'fastapi', 'pyramid', 'tornado'],
  'javascript': ['javascript', 'js', 'node', 'nodejs', 'node.js', 'express', 'typescript', 'ts'],
  'java': ['java', 'spring', 'springboot', 'hibernate', 'maven', 'gradle'],
  'php': ['php', 'laravel', 'codeigniter', 'symfony', 'wordpress'],
  'vue': ['vue', 'vuejs', 'vue.js', 'nuxt', 'nuxtjs'],
  'angular': ['angular', 'angularjs', 'typescript', 'rxjs'],
  'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network', 'tensorflow', 'pytorch'],
  'mern': ['mern', 'mongodb', 'express', 'react', 'node', 'full stack'],
  'mean': ['mean', 'mongodb', 'express', 'angular', 'node'],
  'flutter': ['flutter', 'dart', 'mobile app', 'ios', 'android'],
  'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'solidity', 'web3']
};

// Category keywords
const CATEGORY_KEYWORDS = {
  'ecommerce': ['ecommerce', 'e-commerce', 'online store', 'shopping', 'cart', 'checkout', 'payment'],
  'automation': ['automation', 'automated', 'workflow', 'process automation'],
  'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'chatbot', 'nlp'],
  'hosting': ['hosting', 'cloud', 'deployment', 'server', 'aws', 'azure'],
  'seo': ['seo', 'search engine optimization', 'sem', 'keywords', 'ranking'],
  'healthcare': ['healthcare', 'hospital', 'medical', 'patient', 'clinic', 'pharmacy'],
  'banking': ['banking', 'finance', 'payment', 'transaction', 'account', 'wallet'],
  'iot': ['iot', 'internet of things', 'sensor', 'device', 'arduino', 'raspberry pi'],
  'hr': ['hr', 'human resources', 'employee', 'recruitment', 'attendance', 'payroll'],
  'retail': ['retail', 'inventory', 'pos', 'billing', 'store management'],
  'education': ['education', 'learning', 'lms', 'school', 'college', 'student', 'course'],
  'social': ['social', 'social media', 'community', 'chat', 'messaging', 'forum'],
  'blog': ['blog', 'cms', 'content management', 'article', 'post', 'publishing'],
  'portfolio': ['portfolio', 'resume', 'cv', 'personal website', 'showcase'],
  'restaurant': ['restaurant', 'food', 'menu', 'order', 'delivery', 'cafe'],
  'hospital': ['hospital', 'healthcare', 'medical', 'patient management'],
  'school': ['school', 'education', 'student', 'teacher', 'attendance'],
  'library': ['library', 'book', 'catalog', 'borrow', 'manage'],
  'inventory': ['inventory', 'stock', 'warehouse', 'supply chain', 'product management'],
  'taxi': ['taxi', 'uber', 'cab', 'booking', 'transport', 'ride'],
  'hotel': ['hotel', 'booking', 'reservation', 'accommodation', 'travel'],
  'job': ['job', 'career', 'recruitment', 'job portal', 'job search', 'application'],
  'video': ['video', 'streaming', 'youtube', 'media player', 'video player'],
  'music': ['music', 'audio', 'music player', 'playlist', 'spotify'],
  'weather': ['weather', 'forecast', 'climate', 'api'],
  'todo': ['todo', 'task', 'productivity', 'reminder', 'checklist'],
  'calculator': ['calculator', 'math', 'scientific', 'finance'],
  'quiz': ['quiz', 'test', 'examination', 'question', 'answer'],
  'chat': ['chat', 'messaging', 'real-time', 'communication', 'instant messaging']
};

// Intent-based keywords
const INTENT_KEYWORDS = {
  'buy': ['buy', 'purchase', 'order', 'get', 'acquire'],
  'download': ['download', 'get source', 'source code', 'zip', 'files'],
  'source code': ['source code', 'code', 'github', 'repository', 'repo'],
  'final year': ['final year', 'final year project', 'college project', 'academic', 'degree'],
  'college': ['college', 'student', 'academic', 'assignment', 'project'],
  'professional': ['professional', 'enterprise', 'business', 'production', 'commercial'],
  'template': ['template', 'starter', 'boilerplate', 'framework']
};

// Industry keywords
const INDUSTRY_KEYWORDS = {
  'healthcare': ['healthcare', 'medical', 'hospital', 'clinic', 'pharmacy', 'patient'],
  'banking': ['banking', 'finance', 'financial', 'bank', 'transaction', 'payment'],
  'retail': ['retail', 'shopping', 'store', 'inventory', 'pos'],
  'education': ['education', 'school', 'college', 'university', 'learning', 'lms'],
  'manufacturing': ['manufacturing', 'production', 'factory', 'industrial'],
  'real estate': ['real estate', 'property', 'realty', 'housing', 'estate'],
  'food': ['food', 'restaurant', 'cafe', 'dining', 'delivery'],
  'travel': ['travel', 'tourism', 'hotel', 'booking', 'reservation'],
  'logistics': ['logistics', 'shipping', 'warehouse', 'supply chain', 'delivery'],
  'entertainment': ['entertainment', 'media', 'streaming', 'video', 'music']
};

// Format keywords
const FORMAT_KEYWORDS = {
  'pdf': ['pdf', 'document', 'report'],
  'zip': ['zip', 'archive', 'compressed', 'files'],
  'docx': ['docx', 'word', 'document'],
  'database': ['database', 'sql', 'mysql', 'mongodb', 'postgresql', 'db']
};

/**
 * Extract keywords from text
 * @param {string} text - Text to extract keywords from
 * @returns {Array<string>} Array of keywords
 */
function extractKeywords(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Normalize text: lowercase, remove special chars except spaces and hyphens
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split into words
  const words = normalized.split(/\s+/);
  
  // Filter out stop words and short words (< 2 chars)
  const keywords = words
    .filter(word => word.length >= 2 && !STOP_WORDS.has(word));
  
  // Also extract multi-word phrases (2-3 words)
  const phrases = [];
  for (let i = 0; i < keywords.length - 1; i++) {
    const phrase = `${keywords[i]} ${keywords[i + 1]}`;
    if (phrase.length >= 4 && phrase.length <= 40) {
      phrases.push(phrase);
    }
  }
  
  return [...new Set([...keywords, ...phrases])];
}

/**
 * Generate technology tags from tech stack and text
 * @param {Array<string>} techStack - Technology stack array
 * @param {string} text - Title or description text
 * @returns {Array<string>} Technology tags
 */
function generateTechTags(techStack = [], text = '') {
  const tags = new Set();
  const lowerText = (text || '').toLowerCase();
  
  // Add tech stack directly
  techStack.forEach(tech => {
    if (tech) {
      tags.add(tech.toLowerCase().trim());
      // Extract main tech name (remove version numbers, etc.)
      const mainTech = tech.toLowerCase().split(/[\s-]/)[0];
      if (mainTech.length >= 2) tags.add(mainTech);
    }
  });
  
  // Check text for technology keywords
  Object.entries(TECH_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        tags.add(category);
        tags.add(keyword);
      }
    });
  });
  
  return Array.from(tags);
}

/**
 * Generate category tags
 * @param {string} category - Product category
 * @param {string} text - Title or description
 * @returns {Array<string>} Category tags
 */
function generateCategoryTags(category = '', text = '') {
  const tags = new Set();
  const lowerText = (text || '').toLowerCase();
  const lowerCategory = (category || '').toLowerCase();
  
  // Add category as tag
  if (category) {
    tags.add(category.toLowerCase().trim());
    // Also add category without "Projects" suffix
    const categoryBase = category.replace(/\s*projects?\s*$/i, '').trim();
    if (categoryBase) tags.add(categoryBase.toLowerCase());
  }
  
  // Check for category keywords in text
  Object.entries(CATEGORY_KEYWORDS).forEach(([cat, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword) || lowerCategory.includes(keyword)) {
        tags.add(cat);
      }
    });
  });
  
  return Array.from(tags);
}

/**
 * Generate intent-based tags
 * @param {string} text - Title or description
 * @returns {Array<string>} Intent tags
 */
function generateIntentTags(text = '') {
  const tags = new Set();
  const lowerText = (text || '').toLowerCase();
  
  Object.entries(INTENT_KEYWORDS).forEach(([intent, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        tags.add(intent);
      }
    });
  });
  
  return Array.from(tags);
}

/**
 * Generate industry tags
 * @param {string} text - Title or description
 * @returns {Array<string>} Industry tags
 */
function generateIndustryTags(text = '') {
  const tags = new Set();
  const lowerText = (text || '').toLowerCase();
  
  Object.entries(INDUSTRY_KEYWORDS).forEach(([industry, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        tags.add(industry);
      }
    });
  });
  
  return Array.from(tags);
}

/**
 * Generate format tags
 * @param {string} text - Description or source code info
 * @returns {Array<string>} Format tags
 */
function generateFormatTags(text = '') {
  const tags = new Set();
  const lowerText = (text || '').toLowerCase();
  
  Object.entries(FORMAT_KEYWORDS).forEach(([format, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        tags.add(format);
      }
    });
  });
  
  return Array.from(tags);
}

/**
 * Generate country/language tags
 * @param {string} country - Country code (default: 'IN')
 * @returns {Array<string>} Country/language tags
 */
function generateCountryTags(country = 'IN') {
  const countryMap = {
    'IN': ['india', 'indian', 'in'],
    'US': ['usa', 'united states', 'us'],
    'UK': ['uk', 'united kingdom', 'britain']
  };
  
  return countryMap[country.toUpperCase()] || [country.toLowerCase()];
}

/**
 * Convert tag to slug format (lowercase-hyphen)
 * @param {string} tag - Tag string
 * @returns {string} Slugified tag
 */
function slugifyTag(tag) {
  if (!tag) return '';
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_]+/g, '-')   // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Main function to generate all tags for a product
 * @param {Object} productData - Product data
 * @param {string} productData.title - Product title
 * @param {string} productData.description - Product description
 * @param {Array<string>} productData.techStack - Technology stack
 * @param {string} productData.category - Product category
 * @param {Array<string>} productData.features - Product features
 * @param {string} productData.country - Country code (default: 'IN')
 * @returns {Array<string>} Array of unique, slugified tags
 */
function generateTags(productData = {}) {
  const {
    title = '',
    description = '',
    techStack = [],
    category = '',
    features = [],
    country = 'IN'
  } = productData;
  
  const allTags = new Set();
  const combinedText = `${title} ${description} ${features.join(' ')}`.toLowerCase();
  
  // Extract keywords from title and description
  const titleKeywords = extractKeywords(title);
  const descKeywords = extractKeywords(description);
  
  // Generate different types of tags
  const techTags = generateTechTags(techStack, combinedText);
  const categoryTags = generateCategoryTags(category, combinedText);
  const intentTags = generateIntentTags(combinedText);
  const industryTags = generateIndustryTags(combinedText);
  const formatTags = generateFormatTags(combinedText);
  const countryTags = generateCountryTags(country);
  
  // Combine all tags
  [
    ...titleKeywords.slice(0, 5), // Limit title keywords
    ...descKeywords.slice(0, 5),  // Limit desc keywords
    ...techTags,
    ...categoryTags,
    ...intentTags,
    ...industryTags,
    ...formatTags,
    ...countryTags
  ].forEach(tag => {
    if (tag && tag.length >= 2 && tag.length <= 50) {
      const slugTag = slugifyTag(tag);
      if (slugTag) allTags.add(slugTag);
    }
  });
  
  // Remove duplicates and sort
  return Array.from(allTags)
    .filter(tag => tag.length >= 2) // Minimum length
    .slice(0, 30) // Limit to 30 tags max
    .sort();
}

module.exports = {
  generateTags,
  extractKeywords,
  generateTechTags,
  generateCategoryTags,
  generateIntentTags,
  generateIndustryTags,
  generateFormatTags,
  generateCountryTags,
  slugifyTag
};

