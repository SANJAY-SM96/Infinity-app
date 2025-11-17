// Stop words to remove from slugs
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have',
  'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their',
  'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her',
  'would', 'make', 'like', 'into', 'him', 'time', 'has', 'look', 'two',
  'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could', 'people'
]);

/**
 * Generate a clean URL-friendly slug from a string
 * Removes stop words and optimizes for SEO
 * @param {string} text - The text to convert to a slug
 * @param {Object} options - Options for slug generation
 * @param {boolean} options.removeStopWords - Whether to remove stop words (default: true)
 * @returns {string} - A clean slug (lowercase, hyphens, no special chars, optimized)
 */
function slugify(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const { removeStopWords = true } = options;

  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/[\s_-]+/g, ' ')  // Normalize spaces, underscores, and hyphens to single space
    .trim();

  // Remove stop words if enabled
  if (removeStopWords) {
    const words = slug.split(/\s+/);
    const filteredWords = words.filter(word => 
      word.length > 0 && !STOP_WORDS.has(word)
    );
    slug = filteredWords.join(' ');
  }

  // Convert to hyphenated slug
  slug = slug
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');   // Remove leading and trailing hyphens

  return slug;
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 * @param {string} baseSlug - The base slug to make unique
 * @param {Function} checkExists - Async function that checks if slug exists (returns true if exists)
 * @returns {Promise<string>} - A unique slug
 */
async function generateUniqueSlug(baseSlug, checkExists) {
  if (!baseSlug) {
    throw new Error('Base slug is required');
  }

  let slug = baseSlug;
  let counter = 1;
  
  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Safety check to prevent infinite loops
    if (counter > 1000) {
      throw new Error('Unable to generate unique slug after 1000 attempts');
    }
  }
  
  return slug;
}

module.exports = {
  slugify,
  generateUniqueSlug
};

