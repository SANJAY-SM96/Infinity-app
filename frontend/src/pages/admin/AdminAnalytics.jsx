import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { adminService } from '../../api/adminService';
import { useTheme } from '../../context/ThemeContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiUsers, FiPackage, FiActivity } from 'react-icons/fi';

const COLORS = ['#00d4ff', '#ff006e', '#9333ea', '#10b981', '#f59e0b'];

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const { isDark } = useTheme();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes, orderRes, topRes, categoryRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getSalesChart({ days: parseInt(timeRange) }),
        adminService.getOrderStats(),
        adminService.getTopProducts(),
        adminService.getCategoryStats()
      ]);

      // Handle stats
      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.stats) {
        setStats(statsRes.value.data.stats);
      } else {
        console.error('Failed to fetch stats:', statsRes.reason);
        setStats({
          totalOrders: 0,
          totalUsers: 0,
          totalProducts: 0,
          totalRevenue: 0
        });
      }

      // Handle chart data
      if (chartRes.status === 'fulfilled' && chartRes.value?.data?.chartData) {
        setSalesChart(chartRes.value.data.chartData);
      } else {
        console.error('Failed to fetch chart data:', chartRes.reason);
        setSalesChart([]);
      }

      // Handle order stats
      if (orderRes.status === 'fulfilled' && orderRes.value?.data?.orderStats) {
        setOrderStats(orderRes.value.data.orderStats);
      } else {
        console.error('Failed to fetch order stats:', orderRes.reason);
        setOrderStats([]);
      }

      // Handle top products
      if (topRes.status === 'fulfilled' && topRes.value?.data?.topProducts) {
        setTopProducts(topRes.value.data.topProducts);
      } else {
        console.error('Failed to fetch top products:', topRes.reason);
        setTopProducts([]);
      }

      // Handle category stats
      if (categoryRes.status === 'fulfilled' && categoryRes.value?.data?.categoryStats) {
        setCategoryStats(categoryRes.value.data.categoryStats);
      } else {
        console.error('Failed to fetch category stats:', categoryRes.reason);
        setCategoryStats([]);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set default empty states on error
      setStats({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0
      });
      setSalesChart([]);
      setOrderStats([]);
      setTopProducts([]);
      setCategoryStats([]);
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
    ? 'bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-xl';
  const chartGridColor = isDark ? '#374151' : '#e5e7eb';
  const chartTextColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-3 ${textClass}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics & Insights
              </span>
            </h1>
            <p className={`text-sm sm:text-base ${textMuted}`}>Detailed analytics and insights for your IT project marketplace</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base flex-shrink-0 shadow-lg ${
              isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="7" className={isDark ? 'bg-gray-800' : 'bg-white'}>Last 7 days</option>
            <option value="30" className={isDark ? 'bg-gray-800' : 'bg-white'}>Last 30 days</option>
            <option value="90" className={isDark ? 'bg-gray-800' : 'bg-white'}>Last 90 days</option>
            <option value="365" className={isDark ? 'bg-gray-800' : 'bg-white'}>Last year</option>
          </select>
        </motion.div>

        {/* Revenue Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden`}
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <FiTrendingUp className="text-blue-500" size={24} />
            <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Revenue Overview</h2>
          </div>
          {salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px] md:h-[400px]">
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
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
                    border: `1px solid ${isDark ? '#00d4ff' : '#2563EB'}`,
                    borderRadius: '12px',
                    color: isDark ? '#fff' : '#000',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#00d4ff" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)" 
                  name="Revenue (₹)"
                  dot={{ fill: '#00d4ff', r: 4 }}
                  activeDot={{ r: 6, fill: '#00d4ff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <p className={textMuted}>No data available</p>
            </div>
          )}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden`}
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FiActivity className="text-pink-500" size={24} />
              <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Orders by Status</h2>
            </div>
            {orderStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} className="sm:h-[320px]">
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
              <div className="h-[320px] flex items-center justify-center">
                <p className={textMuted}>No data available</p>
              </div>
            )}
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden`}
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FiPackage className="text-purple-500" size={24} />
              <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Products by Category</h2>
            </div>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} className="sm:h-[320px]">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
                      border: `1px solid ${isDark ? '#00d4ff' : '#2563EB'}`,
                      borderRadius: '12px',
                      color: isDark ? '#fff' : '#000',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center">
                <p className={textMuted}>No data available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6`}
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <FiTrendingUp className="text-green-500" size={24} />
            <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Top Selling Products</h2>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition cursor-pointer group ${
                    isDark ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-orange-500' : 
                      index === 1 ? 'from-gray-300 to-gray-500' : 
                      index === 2 ? 'from-orange-400 to-orange-600' : 
                      'from-blue-500/20 to-pink-500/20'
                    } flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}>
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
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className={`text-primary font-bold text-sm sm:text-base`}>₹{product.revenue?.toFixed(2) || '0.00'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className={textMuted}>No data available</p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}

