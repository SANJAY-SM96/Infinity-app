const express = require('express');
const {
  updateAddress,
  updateAddressById,
  deleteAddress,
  getAllUsers,
  getUserById,
  updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/address', protect, updateAddress);
router.put('/address/:addressId', protect, updateAddressById);
router.delete('/address/:addressId', protect, deleteAddress);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
