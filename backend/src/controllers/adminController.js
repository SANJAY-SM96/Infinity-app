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
