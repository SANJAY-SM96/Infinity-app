const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalOrders, totalUsers, totalProducts, totalRevenue, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        {
          $match: { 'paymentInfo.paymentStatus': 'completed' }
        },
        {
          $group: { _id: null, total: { $sum: '$total' } }
        }
      ]),
      Order.find().populate('user', 'name email').sort('-createdAt').limit(5)
    ]);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          'paymentInfo.paymentStatus': 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        salesData,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSalesChart = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'paymentInfo.paymentStatus': 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      chartData: salesData
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      orderStats
    });
  } catch (error) {
    next(error);
  }
};

exports.getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      }
    ]);

    res.json({
      success: true,
      topProducts
    });
  } catch (error) {
    next(error);
  }
};

exports.getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select('title stock price')
      .limit(20);

    res.json({
      success: true,
      products: lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryStats = async (req, res, next) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categoryStats
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin users
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Soft delete by setting isActive to false, or hard delete
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Ban user
exports.banUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }

    user.isBanned = true;
    user.banReason = reason || 'Violation of terms of service';
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User banned successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Unban user
exports.unbanUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBanned: false,
        banReason: null,
        bannedAt: null,
        bannedBy: null,
        isActive: true
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User unbanned successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Remove user from plan
exports.removeUserFromPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        'subscription.plan': 'free',
        'subscription.status': 'cancelled',
        'subscription.endDate': new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User removed from plan successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update user subscription plan
exports.updateUserPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { plan, status, endDate, autoRenew } = req.body;

    if (!['free', 'basic', 'premium', 'enterprise'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const updateData = {
      'subscription.plan': plan,
      'subscription.status': status || 'active',
      'subscription.startDate': new Date(),
      'subscription.autoRenew': autoRenew !== undefined ? autoRenew : false
    };

    if (endDate) {
      updateData['subscription.endDate'] = new Date(endDate);
    } else if (plan !== 'free') {
      // Default to 30 days from now if no end date provided
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 30);
      updateData['subscription.endDate'] = defaultEndDate;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User plan updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Get all users including banned and inactive
exports.getAllUsersWithFilters = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 100);
    const skip = (page - 1) * limit;
    const { status, role, plan, banned } = req.query;

    const filter = {};
    
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (role) filter.role = role;
    if (plan) filter['subscription.plan'] = plan;
    if (banned === 'true') filter.isBanned = true;
    if (banned === 'false') filter.isBanned = false;

    const [users, total] = await Promise.all([
      User.find(filter)
        .skip(skip)
        .limit(limit)
        .select('-password')
        .sort('-createdAt'),
      User.countDocuments(filter)
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
