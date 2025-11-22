import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../api/adminService';
import AdminLayout from '../components/admin/AdminLayout';
import Loader from '../components/Loader';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import {
  FiTrendingUp, FiUsers, FiPackage, FiDollarSign, FiArrowRight,
  FiShoppingBag, FiActivity, FiFileText, FiPlus, FiSettings, FiClock,
  FiRefreshCw, FiBarChart2, FiCalendar, FiTrendingDown
} from 'react-icons/fi';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { projectRequestService } from '../api/projectRequestService';

const COLORS = ['#2563EB', '#ff006e', '#9333ea', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [requestStats, setRequestStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [timeRange, setTimeRange] = useState('30');
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes, orderRes, topRes, categoryRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getSalesChart({ days: parseInt(timeRange) }),
        adminService.getOrderStats(),
        adminService.getTopProducts(),
        adminService.getCategoryStats()
      ]);

      // Handle stats with error handling
      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.stats) {
        setStats(statsRes.value.data.stats);
        setRecentOrders(statsRes.value.data.stats.recentOrders || []);
      } else {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch stats:', statsRes.reason);
        }
        setStats({
          totalOrders: 0,
          totalUsers: 0,
          totalProducts: 0,
          totalRevenue: 0,
          recentOrders: []
        });
      }

      // Handle chart data with error handling
      if (chartRes.status === 'fulfilled' && chartRes.value?.data?.chartData) {
        setChartData(chartRes.value.data.chartData);
      } else {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch chart data:', chartRes.reason);
        }
        setChartData([]);
      }

      // Handle order stats with error handling
      if (orderRes.status === 'fulfilled' && orderRes.value?.data?.orderStats) {
        setOrderStats(orderRes.value.data.orderStats);
      } else {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch order stats:', orderRes.reason);
        }
        setOrderStats([]);
      }

      // Handle top products with error handling
      if (topRes.status === 'fulfilled' && topRes.value?.data?.topProducts) {
        setTopProducts(topRes.value.data.topProducts);
      } else {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch top products:', topRes.reason);
        }
        setTopProducts([]);
      }

      // Handle category stats with error handling
      if (categoryRes.status === 'fulfilled' && categoryRes.value?.data?.categoryStats) {
        setCategoryStats(categoryRes.value.data.categoryStats);
      } else {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch category stats:', categoryRes.reason);
        }
        setCategoryStats([]);
      }

      // Handle project requests separately
      try {
        const requestsRes = await projectRequestService.getAll({ limit: 5, page: 1 });
        const requests = requestsRes.data.requests || requestsRes.data.projectRequests || [];
        setRecentRequests(requests);

        const allRequestsRes = await projectRequestService.getAll({ limit: 1000 });
        const allRequests = allRequestsRes.data.requests || allRequestsRes.data.projectRequests || [];
        setRequestStats({
          total: allRequests.length,
          pending: allRequests.filter(r => r.status === 'pending').length,
          approved: allRequests.filter(r => r.status === 'approved' || r.status === 'completed').length,
          rejected: allRequests.filter(r => r.status === 'rejected').length
        });
      } catch (reqError) {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch project requests:', reqError);
        }
        setRecentRequests([]);
        setRequestStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch admin data:', error);
      }
      // Set default empty states on error
      setStats({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        recentOrders: []
      });
      setChartData([]);
      setOrderStats([]);
      setTopProducts([]);
      setCategoryStats([]);
      setRecentRequests([]);
      setRequestStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFormClose = () => {
    setShowRequestForm(false);
    fetchData();
  };

  // Consistent design tokens
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-full space-y-6 sm:space-y-8">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 ${textClass}`}>
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard Overview
            </span>
          </h2>
          <Loader />
        </div>
      </AdminLayout>
    );
  }
  const cardBg = isDark
    ? 'bg-gray-800/60 backdrop-blur-xl border-gray-700/50'
    : 'bg-white/80 backdrop-blur-xl border-gray-200/50';
  const chartGridColor = isDark ? '#374151' : '#e5e7eb';
  const chartTextColor = isDark ? '#9ca3af' : '#6b7280';

  // Calculate revenue growth
  const revenueGrowth = chartData.length > 1
    ? ((chartData[chartData.length - 1]?.sales || 0) - (chartData[0]?.sales || 0)) / (chartData[0]?.sales || 1) * 100
    : 0;

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      iconColor: 'text-blue-500',
      bgGradient: isDark ? 'from-blue-500/20 via-blue-500/10 to-blue-500/5' : 'from-blue-500/15 via-blue-500/8 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      link: '/admin/orders',
      change: '+12%',
      changeColor: 'text-green-500',
      changeIcon: FiTrendingUp
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      iconColor: 'text-pink-500',
      bgGradient: isDark ? 'from-pink-500/20 via-pink-500/10 to-pink-500/5' : 'from-pink-500/15 via-pink-500/8 to-pink-500/5',
      borderColor: 'border-pink-500/30',
      link: '/admin/users',
      change: '+8%',
      changeColor: 'text-green-500',
      changeIcon: FiTrendingUp
    },
    {
      title: 'Total Projects',
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      iconColor: 'text-green-500',
      bgGradient: isDark ? 'from-green-500/20 via-green-500/10 to-green-500/5' : 'from-green-500/15 via-green-500/8 to-green-500/5',
      borderColor: 'border-green-500/30',
      link: '/admin/projects',
      change: '+5%',
      changeColor: 'text-green-500',
      changeIcon: FiTrendingUp
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      iconColor: 'text-yellow-500',
      bgGradient: isDark ? 'from-yellow-500/20 via-yellow-500/10 to-yellow-500/5' : 'from-yellow-500/15 via-yellow-500/8 to-yellow-500/5',
      borderColor: 'border-yellow-500/30',
      link: '/admin/analytics',
      change: revenueGrowth > 0 ? `+${revenueGrowth.toFixed(1)}%` : `${revenueGrowth.toFixed(1)}%`,
      changeColor: revenueGrowth > 0 ? 'text-green-500' : 'text-red-500',
      changeIcon: revenueGrowth > 0 ? FiTrendingUp : FiTrendingDown
    }
  ];

  const quickActions = [
    { label: 'New Project', icon: FiPackage, action: () => navigate('/admin/projects/add'), color: 'from-blue-500 to-indigo-600' },
    { label: 'View Orders', icon: FiShoppingBag, action: () => navigate('/admin/orders'), color: 'from-pink-500 to-rose-600' },
    { label: 'Analytics', icon: FiBarChart2, action: () => navigate('/admin/analytics'), color: 'from-green-500 to-emerald-600' },
    { label: 'Settings', icon: FiSettings, action: () => navigate('/admin/settings'), color: 'from-purple-500 to-violet-600' }
  ];

  return (
    <AdminLayout>
      <div className="w-full space-y-6 sm:space-y-8">
        {/* Header Section - Perfect Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 ${textClass}`}>
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </span>
              </h1>
              <p className={`${textMuted} text-sm sm:text-base`}>
                Welcome back, <span className="font-semibold text-primary">{user?.name || 'Admin'}</span>! Here's what's happening with your IT project marketplace.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                className={`p-3 rounded-xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all shadow-lg hover:shadow-xl`}
                title="Refresh"
              >
                <FiRefreshCw className={textClass} size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRequestForm(true)}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-secondary via-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FiFileText size={16} />
                <span className="hidden sm:inline">Create Request</span>
                <span className="sm:hidden">Request</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/projects/add')}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FiPlus size={16} />
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Action Buttons - Perfect Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className={`relative overflow-hidden ${cardBg} border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} rounded-xl p-4 sm:p-5 transition-all duration-300 shadow-lg hover:shadow-2xl group h-full`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <span className={`${textClass} text-xs sm:text-sm font-semibold text-center`}>{action.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Cards - Perfect Grid with Equal Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            const ChangeIcon = card.changeIcon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative group cursor-pointer h-full"
              >
                <Link to={card.link} className="block h-full">
                  <div className={`relative h-full min-h-[160px] bg-gradient-to-br ${card.bgGradient} ${cardBg} border ${card.borderColor} rounded-xl p-6 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl flex flex-col`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />

                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-3 rounded-xl border-2 ${card.borderColor} bg-gradient-to-br ${card.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={card.iconColor} size={24} />
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${card.changeColor.includes('green') ? 'bg-green-500/10' : 'bg-red-500/10'} border ${card.changeColor.includes('green') ? 'border-green-500/20' : 'border-red-500/20'}`}>
                          <ChangeIcon className={card.changeColor} size={12} />
                          <span className={`text-xs font-bold ${card.changeColor}`}>{card.change}</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className={`${textMuted} text-xs font-medium mb-2 uppercase tracking-wider`}>{card.title}</p>
                          <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${textClass}`}>{card.value}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-6 pt-3 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                          <div className={`h-2 w-16 rounded-full ${card.iconColor.replace('text-', 'bg-')}`} />
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

        {/* Charts Grid - Equal Height, Perfect Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue Overview Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBg} border rounded-xl p-6 shadow-xl overflow-hidden flex flex-col h-full`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <FiTrendingUp className="text-blue-500" size={20} />
                </div>
                <div>
                  <h2 className={`${textClass} text-lg sm:text-xl font-bold`}>Revenue Overview</h2>
                  <p className={`${textMuted} text-sm`}>Real-time tracking • Last {timeRange} days</p>
                </div>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm transition ${isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary/50`}
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
            <div className="flex-1 min-h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.5} />
                    <XAxis
                      dataKey="_id"
                      stroke={chartTextColor}
                      fontSize={12}
                      tick={{ fill: chartTextColor }}
                      tickLine={{ stroke: chartGridColor }}
                    />
                    <YAxis
                      stroke={chartTextColor}
                      fontSize={12}
                      tick={{ fill: chartTextColor }}
                      tickLine={{ stroke: chartGridColor }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDark ? '#3b82f6' : '#2563EB'}`,
                        borderRadius: '12px',
                        color: isDark ? '#fff' : '#000',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#2563EB"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      name="Revenue (₹)"
                      dot={{ fill: '#2563EB', r: 4 }}
                      activeDot={{ r: 6, fill: '#2563EB' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className={textMuted}>No data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Status Chart - Equal Height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBg} border rounded-xl p-6 shadow-xl overflow-hidden flex flex-col h-full`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <FiActivity className="text-pink-500" size={20} />
                </div>
                <div>
                  <h2 className={`${textClass} text-lg sm:text-xl font-bold`}>Orders by Status</h2>
                  <p className={`${textMuted} text-sm`}>Current distribution</p>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              {orderStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} opacity={0.5} />
                    <XAxis
                      dataKey="_id"
                      stroke={chartTextColor}
                      fontSize={12}
                      tick={{ fill: chartTextColor }}
                      tickLine={{ stroke: chartGridColor }}
                    />
                    <YAxis
                      stroke={chartTextColor}
                      fontSize={12}
                      tick={{ fill: chartTextColor }}
                      tickLine={{ stroke: chartGridColor }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDark ? '#ec4899' : '#ff006e'}`,
                        borderRadius: '12px',
                        color: isDark ? '#fff' : '#000',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 'bold' }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#ff006e"
                      name="Count"
                      radius={[12, 12, 0, 0]}
                      stroke="#ff006e"
                      strokeWidth={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className={textMuted}>No data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Category Stats & Top Products - Equal Height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Category Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} border rounded-xl p-6 shadow-xl overflow-hidden flex flex-col h-full`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <FiPackage className="text-purple-500" size={20} />
              </div>
              <h2 className={`${textClass} text-lg sm:text-xl font-bold`}>Products by Category</h2>
            </div>
            <div className="flex-1 min-h-[280px]">
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="count"
                      stroke={isDark ? '#374151' : '#ffffff'}
                      strokeWidth={2}
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDark ? '#2563EB' : '#2563EB'}`,
                        borderRadius: '12px',
                        color: isDark ? '#fff' : '#000',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className={textMuted}>No data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${cardBg} border rounded-xl p-6 shadow-xl flex flex-col h-full`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <FiTrendingUp className="text-green-500" size={20} />
                </div>
                <div>
                  <h2 className={`${textClass} text-lg sm:text-xl font-bold`}>Top Selling Products</h2>
                  <p className={`${textMuted} text-sm`}>Best performers</p>
                </div>
              </div>
              <Link to="/admin/projects" className="text-primary hover:text-blue-600 text-xs sm:text-sm font-medium flex items-center gap-1 group w-fit">
                View all <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts.slice(0, 5).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all cursor-pointer group`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 ${index === 0 ? 'from-yellow-400 to-orange-500' :
                            index === 1 ? 'from-gray-300 to-gray-500' :
                              index === 2 ? 'from-orange-400 to-orange-600' :
                                'from-blue-500/20 to-pink-500/20'
                          }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${textClass} font-semibold text-sm truncate`}>
                            {product.productDetails?.[0]?.title || 'Unknown Product'}
                          </p>
                          <p className={`${textMuted} text-xs`}>
                            {product.quantity} sold • ₹{product.revenue?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-primary font-bold text-sm sm:text-base">₹{product.revenue?.toFixed(2) || '0.00'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center min-h-[280px]">
                  <p className={textMuted}>No data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Project Requests Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${cardBg} border rounded-xl p-6 shadow-xl`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <FiFileText className="text-primary" size={20} />
              </div>
              <div>
                <h2 className={`${textClass} text-lg sm:text-xl font-bold`}>Project Requests Management</h2>
                <p className={`${textMuted} text-sm`}>Manage incoming project requests</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {requestStats.pending > 0 && (
                <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} border flex items-center gap-2`}>
                  <FiClock className="text-yellow-500" size={14} />
                  <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    {requestStats.pending} Pending
                  </span>
                </div>
              )}
              <Link
                to="/admin/project-requests"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FiSettings size={16} />
                <span className="hidden sm:inline">Manage Requests</span>
                <span className="sm:hidden">Manage</span>
              </Link>
            </div>
          </div>

          {/* Request Stats - Perfect Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`${textMuted} text-xs mb-2`}>Total</p>
              <p className={`${textClass} text-2xl font-bold`}>{requestStats.total}</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'} border ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'}`}>
              <p className={`${textMuted} text-xs mb-2`}>Pending</p>
              <p className={`text-yellow-500 text-2xl font-bold`}>{requestStats.pending}</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/10' : 'bg-green-50'} border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
              <p className={`${textMuted} text-xs mb-2`}>Approved</p>
              <p className={`text-green-500 text-2xl font-bold`}>{requestStats.approved}</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/10' : 'bg-red-50'} border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
              <p className={`${textMuted} text-xs mb-2`}>Rejected</p>
              <p className={`text-red-500 text-2xl font-bold`}>{requestStats.rejected}</p>
            </div>
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate('/admin/project-requests')}
                  className={`flex items-start justify-between p-4 rounded-xl cursor-pointer transition-all ${isDark ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    } group`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`${textClass} font-semibold text-sm mb-2 truncate`}>{request.projectTitle}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                          request.status === 'completed' || request.status === 'approved' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                            'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                        }`}>
                        {request.status}
                      </span>
                      <span className={`${textMuted} text-xs`}>{request.domain}</span>
                      <span className={`${textMuted} text-xs`}>•</span>
                      <span className={`${textClass} font-bold text-sm`}>
                        {request.currency === 'INR' ? '₹' : '$'}{request.budget?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <p className={`${textMuted} text-xs mt-2`}>
                      {request.name} • {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <FiArrowRight
                      className={`${isDark ? 'text-gray-500' : 'text-gray-400'} group-hover:text-primary group-hover:translate-x-1 transition-all`}
                      size={18}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${isDark ? 'bg-primary/10' : 'bg-blue-50'} flex items-center justify-center`}>
                <FiFileText className="text-primary" size={24} />
              </div>
              <p className={`${textClass} font-medium text-sm mb-1`}>No project requests</p>
              <p className={`${textMuted} text-xs`}>Requests will appear here when submitted</p>
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${cardBg} border rounded-xl p-6 shadow-xl overflow-hidden`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <FiShoppingBag className="text-blue-500" size={20} />
              </div>
              <div>
                <h2 className={`${textClass} text-lg sm:text-xl font-bold`}>Recent Orders</h2>
                <p className={`${textMuted} text-sm`}>Latest transactions</p>
              </div>
            </div>
            <Link to="/admin/orders" className="text-primary hover:text-blue-600 text-xs sm:text-sm font-medium flex items-center gap-1 group w-fit">
              View all <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className={`border-b ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <th className={`text-left py-4 px-4 ${textMuted} text-xs sm:text-sm font-semibold uppercase`}>Order ID</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-xs sm:text-sm font-semibold uppercase`}>Customer</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-xs sm:text-sm font-semibold uppercase`}>Amount</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-xs sm:text-sm font-semibold uppercase`}>Status</th>
                    <th className={`text-left py-4 px-4 ${textMuted} text-xs sm:text-sm font-semibold uppercase`}>Date</th>
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
                        <span className={`${textClass} font-mono text-xs sm:text-sm font-semibold`}>
                          #{order._id.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className={`${textClass} font-medium text-xs sm:text-sm`}>{order.user?.name || 'N/A'}</p>
                          <p className={`${textMuted} text-xs hidden sm:block`}>{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-primary font-bold text-sm sm:text-base">₹{order.total?.toFixed(2) || '0.00'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                              order.orderStatus === 'Processing' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className={`py-4 px-4 ${textMuted} text-xs sm:text-sm`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-primary/10' : 'bg-blue-50'} flex items-center justify-center`}>
                <FiShoppingBag className="text-primary" size={32} />
              </div>
              <p className={`${textClass} font-medium`}>No recent orders</p>
              <p className={`${textMuted} text-sm mt-2`}>Orders will appear here once customers start placing them</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Project Request Form Modal */}
      <ProjectRequestForm
        isOpen={showRequestForm}
        onClose={handleRequestFormClose}
      />
    </AdminLayout>
  );
}
