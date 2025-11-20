/**
 * Image optimization utilities for better performance and SEO
 */

/**
 * Generate optimized image srcset for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {Array<number>} sizes - Array of width sizes
 * @returns {string} srcset string
 */
export function generateSrcSet(baseUrl, sizes = [400, 800, 1200, 1600]) {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param {Object} breakpoints - Breakpoint configuration
 * @returns {string} sizes attribute
 */
export function generateSizes(breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
}) {
  return `(max-width: 640px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
}

/**
 * Lazy load image with intersection observer
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source URL
 */
export function lazyLoadImage(img, src) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src;
  }
}

/**
 * Generate optimized alt text for product images with keyword-rich descriptions
 * @param {string} productTitle - Product title
 * @param {number} index - Image index
 * @param {string} category - Product category (optional)
 * @param {Array<string>} techStack - Technology stack (optional)
 * @returns {string} Alt text
 */
export function generateImageAlt(productTitle, index = 0, category = '', techStack = []) {
  const techString = techStack.length > 0 ? ` ${techStack.slice(0, 2).join(', ')}` : '';
  const categoryString = category ? ` ${category}` : '';
  
  if (index === 0) {
    return `${productTitle} - IT Project${categoryString}${techString} with Complete Source Code, Documentation & Database | Buy Online at Infinity Marketplace`;
  }
  return `${productTitle} - Screenshot ${index + 1} showing${categoryString}${techString} features and UI | Infinity IT Project Marketplace`;
}

/**
 * Generate alt text for blog images
 * @param {string} blogTitle - Blog title
 * @param {string} category - Blog category (optional)
 * @returns {string} Alt text
 */
export function generateBlogImageAlt(blogTitle, category = '') {
  const categoryString = category ? ` about ${category}` : '';
  return `${blogTitle}${categoryString} - IT Project Blog Article | Infinity Technology Blog`;
}

/**
 * Generate alt text for general images
 * @param {string} description - Image description
 * @param {string} context - Context (e.g., 'testimonial', 'feature', 'logo')
 * @returns {string} Alt text
 */
export function generateGeneralImageAlt(description, context = '') {
  const contextString = context ? ` ${context}` : '';
  return `${description}${contextString} - Infinity IT Project Marketplace`;
}

/**
 * Preload critical images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls) {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}

/**
 * Convert image URL to WebP format (requires backend support)
 * @param {string} imageUrl - Original image URL
 * @returns {string} WebP image URL
 */
export function getWebPImage(imageUrl) {
  if (!imageUrl) return '';
  // If image URL contains query params, append format=webp, otherwise use ?
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}format=webp`;
}

/**
 * Generate responsive image srcset with WebP support
 * @param {string} baseUrl - Base image URL
 * @param {Array<number>} sizes - Array of width sizes
 * @param {boolean} useWebP - Whether to use WebP format
 * @returns {string} srcset string
 */
export function generateResponsiveSrcSet(baseUrl, sizes = [400, 800, 1200, 1600], useWebP = false) {
  if (!baseUrl) return '';
  
  const formatParam = useWebP ? 'format=webp&' : '';
  return sizes
    .map(size => {
      const separator = baseUrl.includes('?') ? '&' : '?';
      const url = `${baseUrl}${separator}${formatParam}w=${size}`;
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Create picture element source for WebP with fallback
 * @param {string} imageUrl - Original image URL
 * @param {Array<number>} sizes - Width sizes for srcset
 * @returns {Object} Object with webpSrcSet and fallbackSrcSet
 */
export function createPictureSources(imageUrl, sizes = [400, 800, 1200, 1600]) {
  return {
    webpSrcSet: generateResponsiveSrcSet(imageUrl, sizes, true),
    fallbackSrcSet: generateResponsiveSrcSet(imageUrl, sizes, false),
    sizes: generateSizes()
  };
}

