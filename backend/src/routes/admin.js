const express = require('express');
const {
  getDashboardStats,
  getSalesChart,
  getOrderStats,
  getTopProducts,
  getLowStockProducts,
  getCategoryStats
} = require('../controllers/adminController');
const {
  getAllUsers,
  getUserById,
  updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Dashboard routes
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/dashboard/sales-chart', protect, admin, getSalesChart);
router.get('/dashboard/order-stats', protect, admin, getOrderStats);
router.get('/dashboard/top-products', protect, admin, getTopProducts);
router.get('/dashboard/low-stock', protect, admin, getLowStockProducts);
router.get('/dashboard/category-stats', protect, admin, getCategoryStats);

// User management routes
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
