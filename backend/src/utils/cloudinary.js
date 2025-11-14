/**
 * Cloudinary Integration Helper
 * 
 * To use Cloudinary:
 * 1. Install: npm install cloudinary
 * 2. Set up environment variables:
 *    - CLOUDINARY_CLOUD_NAME
 *    - CLOUDINARY_API_KEY
 *    - CLOUDINARY_API_SECRET
 * 3. Use this helper in your controllers
 */

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Upload image to Cloudinary
 * @param {String} imagePath - Path to image file or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
exports.uploadImage = async (imagePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'infinity-app/products',
      resource_type: 'image',
      ...options
    };

    const result = await cloudinary.uploader.upload(imagePath, defaultOptions);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Upload video to Cloudinary
 * @param {String} videoPath - Path to video file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
exports.uploadVideo = async (videoPath, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'infinity-app/videos',
      resource_type: 'video',
      ...options
    };

    const result = await cloudinary.uploader.upload(videoPath, defaultOptions);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Public ID of the file
 * @param {String} resourceType - 'image' or 'video'
 * @returns {Promise<Object>} Deletion result
 */
exports.deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Upload multiple images
 * @param {Array<String>} imagePaths - Array of image paths
 * @param {Object} options - Upload options
 * @returns {Promise<Array<Object>>} Array of upload results
 */
exports.uploadMultipleImages = async (imagePaths, options = {}) => {
  try {
    const uploadPromises = imagePaths.map(path => 
      exports.uploadImage(path, options)
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

/**
 * Transform image URL (for optimization)
 * @param {String} publicId - Public ID of the image
 * @param {Object} transformations - Cloudinary transformations
 * @returns {String} Transformed URL
 */
exports.getTransformedUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    width: 800,
    height: 600,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    ...transformations
  };

  return cloudinary.url(publicId, defaultTransformations);
};

module.exports = exports;

