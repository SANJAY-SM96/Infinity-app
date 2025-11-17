const User = require('../models/User');

exports.updateAddress = async (req, res, next) => {
  try {
    const { label, fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    const newAddress = {
      label,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault
    };

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAddressById = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { label, fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    Object.assign(address, { label, fullName, phone, line1, line2, city, state, postalCode, country });

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
      address.isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Address deleted successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ isActive: true }).skip(skip).limit(limit).select('-password'),
      User.countDocuments({ isActive: true })
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};
