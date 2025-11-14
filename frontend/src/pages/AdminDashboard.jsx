import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { adminService } from '../api/adminService';
import AdminLayout from '../components/admin/AdminLayout';
import Loader from '../components/Loader';
import { useTheme } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FiTrendingUp, FiUsers, FiPackage, FiDollarSign, FiArrowRight, FiShoppingBag, FiActivity } from 'react-icons/fi';

const COLORS = ['#2563EB', '#ff006e', '#9333ea', '#10b981', '#f59e0b'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes, orderRes, topRes, categoryRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSalesChart({ days: 30 }),
        adminService.getOrderStats(),
        adminService.getTopProducts(),
        adminService.getCategoryStats()
      ]);

      setStats(statsRes.data.stats);
      setChartData(chartRes.data.chartData);
      setOrderStats(orderRes.data.orderStats);
      setTopProducts(topRes.data.topProducts);
      setCategoryStats(categoryRes.data.categoryStats);
      setRecentOrders(statsRes.data.stats.recentOrders || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const chartGridColor = isDark ? '#333' : '#e5e7eb';
  const chartTextColor = isDark ? '#999' : '#666';

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      iconColor: 'text-blue-500',
      bgGradient: isDark ? 'from-blue-500/20 to-blue-500/5' : 'from-blue-500/10 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      link: '/admin/orders',
      change: '+12%',
      changeColor: 'text-green-500'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      iconColor: 'text-pink-500',
      bgGradient: isDark ? 'from-pink-500/20 to-pink-500/5' : 'from-pink-500/10 to-pink-500/5',
      borderColor: 'border-pink-500/30',
      link: '/admin/users',
      change: '+8%',
      changeColor: 'text-green-500'
    },
    {
      title: 'Total Projects',
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      iconColor: 'text-green-500',
      bgGradient: isDark ? 'from-green-500/20 to-green-500/5' : 'from-green-500/10 to-green-500/5',
      borderColor: 'border-green-500/30',
      link: '/admin/projects',
      change: '+5%',
      changeColor: 'text-green-500'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      iconColor: 'text-yellow-500',
      bgGradient: isDark ? 'from-yellow-500/20 to-yellow-500/5' : 'from-yellow-500/10 to-yellow-500/5',
      borderColor: 'border-yellow-500/30',
      link: '/admin/analytics',
      change: '+23%',
      changeColor: 'text-green-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 ${textClass}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard Overview
              </span>
            </h1>
            <p className={textMuted}>Welcome back! Here's what's happening with your IT project marketplace.</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative group cursor-pointer h-full"
              >
                <Link to={card.link} className="block h-full">
                  <div className={`relative h-full min-h-[180px] bg-gradient-to-br ${card.bgGradient} ${cardBg} border ${card.borderColor} rounded-2xl p-6 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl flex flex-col`}>
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl border-2 ${card.borderColor} bg-gradient-to-br ${card.bgGradient}`}>
                          <Icon className={card.iconColor} size={24} />
                        </div>
                        <span className={`text-xs font-bold ${card.changeColor} bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20`}>
                          {card.change}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className={`${textMuted} text-xs font-medium mb-2 uppercase tracking-wider`}>{card.title}</p>
                          <p className={`text-3xl font-extrabold ${textClass} mb-1`}>{card.value}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-2">
                          <div className={`h-1.5 w-12 rounded-full ${card.iconColor.replace('text-', 'bg-')}`} />
                          <span className={`text-xs ${textMuted}`}>View details →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBg} border rounded-2xl p-6 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`${textClass} text-xl font-bold mb-1`}>Sales Overview</h2>
                <p className={textMuted}>Last 30 days</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <FiTrendingUp className="text-blue-500" size={20} />
              </div>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="_id" stroke={chartTextColor} fontSize={12} />
                  <YAxis stroke={chartTextColor} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1a1f28' : '#ffffff',
                      border: `1px solid ${isDark ? '#2563EB' : '#2563EB'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2563EB" 
                    fillOpacity={1}
                    fill="url(#colorSales)" 
                    name="Sales (₹)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className={textMuted}>No data available</p>
              </div>
            )}
          </motion.div>

          {/* Order Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBg} border rounded-2xl p-6 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`${textClass} text-xl font-bold mb-1`}>Orders by Status</h2>
                <p className={textMuted}>Current distribution</p>
              </div>
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <FiActivity className="text-pink-500" size={20} />
              </div>
            </div>
            {orderStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="_id" stroke={chartTextColor} fontSize={12} />
                  <YAxis stroke={chartTextColor} fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1a1f28' : '#ffffff',
                      border: `1px solid ${isDark ? '#ff006e' : '#ff006e'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }} 
                  />
                  <Bar dataKey="count" fill="#ff006e" name="Count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className={textMuted}>No data available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Category Stats & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} border rounded-2xl p-6 shadow-xl`}
          >
            <h2 className={`${textClass} text-xl font-bold mb-6`}>Products by Category</h2>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1a1f28' : '#ffffff',
                      border: `1px solid ${isDark ? '#2563EB' : '#2563EB'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className={textMuted}>No data available</p>
              </div>
            )}
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${cardBg} border rounded-2xl p-6 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`${textClass} text-xl font-bold mb-1`}>Top Selling Products</h2>
                <p className={textMuted}>Best performers</p>
              </div>
              <Link to="/admin/projects" className="text-primary hover:text-blue-600 text-sm font-medium flex items-center gap-1 group">
                View all <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.slice(0, 5).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${index === 0 ? 'from-yellow-400 to-orange-500' : index === 1 ? 'from-gray-300 to-gray-500' : index === 2 ? 'from-orange-400 to-orange-600' : 'from-blue-500/20 to-pink-500/20'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`${textClass} font-semibold text-sm`}>
                          {product.productDetails?.[0]?.title || 'Unknown Product'}
                        </p>
                        <p className={textMuted}>
                          {product.quantity} sold • ₹{product.revenue?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">₹{product.revenue?.toFixed(2) || '0.00'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className={textMuted}>No data available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${cardBg} border rounded-2xl p-6 shadow-xl`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`${textClass} text-xl font-bold mb-1`}>Recent Orders</h2>
              <p className={textMuted}>Latest transactions</p>
            </div>
            <Link to="/admin/orders" className="text-primary hover:text-blue-600 text-sm font-medium flex items-center gap-1 group">
              View all <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <th className={`text-left py-4 px-4 ${textMuted} text-sm font-semibold uppercase`}>Order ID</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-sm font-semibold uppercase`}>Customer</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-sm font-semibold uppercase`}>Amount</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-sm font-semibold uppercase`}>Status</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-sm font-semibold uppercase`}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-all`}
                    >
                      <td className="py-4 px-4">
                        <span className={`${textClass} font-mono text-sm font-semibold`}>
                          #{order._id.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className={`${textClass} font-medium text-sm`}>{order.user?.name || 'N/A'}</p>
                          <p className={textMuted}>{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-primary font-bold text-lg">₹{order.total?.toFixed(2) || '0.00'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                          order.orderStatus === 'Processing' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-500 border border-red-500/30'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className={`py-4 px-4 ${textMuted} text-sm`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center rounded-xl border">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-primary/10' : 'bg-blue-50'} flex items-center justify-center`}>
                <FiShoppingBag className="text-primary" size={32} />
              </div>
              <p className={`${textClass} font-medium`}>No recent orders</p>
              <p className={`${textMuted} text-sm mt-2`}>Orders will appear here once customers start placing them</p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
