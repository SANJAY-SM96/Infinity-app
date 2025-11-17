const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const { orderValidation, validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post('/', protect, orderValidation, validateRequest, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/admin/all', protect, admin, getAllOrders);

module.exports = router;
