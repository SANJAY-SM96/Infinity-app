/**
 * Generate relevant blog post images using Unsplash Source API
 * This provides free, high-quality images based on keywords
 */

/**
 * Generate Unsplash image URL for blog post
 * @param {string} title - Blog post title
 * @param {string} category - Blog category
 * @param {Array<string>} keywords - Keywords related to the blog
 * @param {string} dimensions - Image dimensions (default: 1200x630 for OG images)
 * @returns {string} Unsplash Source API URL
 */
function generateUnsplashImage(title, category, keywords = [], dimensions = '1200x630') {
  try {
    // Clean and prepare search terms
    const cleanTitle = title
      .replace(/[^\w\s]/g, ' ') // Remove special chars
      .replace(/\s+/g, ',') // Replace spaces with commas
      .substring(0, 50) // Limit length
      .toLowerCase();
    
    const cleanCategory = category
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ',')
      .toLowerCase();
    
    const keywordsStr = keywords
      .slice(0, 3) // Limit to 3 keywords
      .map(k => k.trim().replace(/[^\w\s]/g, '').toLowerCase())
      .filter(k => k.length > 2)
      .join(',');
    
    // Combine all search terms
    const searchTerms = [cleanCategory, cleanTitle, keywordsStr]
      .filter(term => term && term.length > 0)
      .join(',');
    
    // Generate Unsplash Source API URL
    // Format: https://source.unsplash.com/WIDTHxHEIGHT/?keyword1,keyword2
    const imageUrl = `https://source.unsplash.com/${dimensions}/?${encodeURIComponent(searchTerms)},technology,programming,coding`;
    
    return imageUrl;
  } catch (error) {
    console.error('Error generating Unsplash image URL:', error);
    // Fallback to a generic technology image
    return `https://source.unsplash.com/${dimensions}/?technology,coding,programming`;
  }
}

/**
 * Generate multiple image URL options for a blog post
 * @param {string} title - Blog post title
 * @param {string} category - Blog category
 * @param {Array<string>} keywords - Keywords related to the blog
 * @returns {Array<string>} Array of image URLs
 */
function generateImageOptions(title, category, keywords = []) {
  const dimensions = ['1200x630', '1600x900', '1920x1080'];
  
  return dimensions.map(dim => ({
    url: generateUnsplashImage(title, category, keywords, dim),
    dimensions: dim,
    type: 'unsplash'
  }));
}

/**
 * Generate a featured image URL optimized for blog posts
 * Uses category-specific keywords for better relevance
 * @param {string} title - Blog post title
 * @param {string} category - Blog category
 * @param {Array<string>} keywords - Additional keywords
 * @returns {string} Optimized image URL
 */
function generateFeaturedImage(title, category, keywords = []) {
  // Category-specific keyword mapping for better image relevance
  const categoryKeywords = {
    'React Projects': ['react', 'javascript', 'frontend', 'web-development'],
    'Python Projects': ['python', 'programming', 'backend', 'data-science'],
    'AI/ML Projects': ['artificial-intelligence', 'machine-learning', 'neural-network', 'data-analysis'],
    'Full-Stack Projects': ['fullstack', 'web-development', 'mern', 'application'],
    'Web Development': ['web-development', 'html', 'css', 'javascript', 'responsive'],
    'Mobile Development': ['mobile-app', 'react-native', 'flutter', 'ios', 'android'],
    'Tutorials': ['tutorial', 'learning', 'education', 'coding'],
    'Industry News': ['technology', 'news', 'innovation', 'tech-trends']
  };
  
  // Get category-specific keywords
  const catKeywords = categoryKeywords[category] || ['technology', 'programming'];
  
  // Combine category keywords with provided keywords
  const allKeywords = [...catKeywords, ...keywords].slice(0, 5);
  
  return generateUnsplashImage(title, category, allKeywords, '1200x630');
}

module.exports = {
  generateUnsplashImage,
  generateImageOptions,
  generateFeaturedImage
};

