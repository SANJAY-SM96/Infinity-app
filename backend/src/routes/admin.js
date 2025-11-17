const express = require('express');
const {
  getDashboardStats,
  getSalesChart,
  getOrderStats,
  getTopProducts,
  getLowStockProducts,
  getCategoryStats,
  deleteUser,
  banUser,
  unbanUser,
  removeUserFromPlan,
  updateUserPlan,
  getAllUsersWithFilters
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
router.get('/users', protect, admin, getAllUsersWithFilters);
router.get('/users/all', protect, admin, getAllUsers); // Keep old endpoint for backward compatibility
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);
router.post('/users/:id/ban', protect, admin, banUser);
router.post('/users/:id/unban', protect, admin, unbanUser);
router.post('/users/:id/remove-plan', protect, admin, removeUserFromPlan);
router.put('/users/:id/plan', protect, admin, updateUserPlan);

module.exports = router;
