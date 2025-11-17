const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  addReview,
  getFeaturedProducts,
  getTrendingProducts,
  getTopSellingProducts,
  getNewUploads,
  getWebBasedProjects
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { productValidation, validateRequest } = require('../middleware/validateRequest');
const { uploadSourceCode } = require('../utils/upload');

const router = express.Router();

router.get('/', listProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/top-selling', getTopSellingProducts);
router.get('/new-uploads', getNewUploads);
router.get('/web-based', getWebBasedProjects);
router.get('/:id', getProduct);
router.post('/', protect, admin, uploadSourceCode, productValidation, validateRequest, createProduct);
router.put('/:id', protect, admin, uploadSourceCode, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/featured', protect, admin, toggleFeatured);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
