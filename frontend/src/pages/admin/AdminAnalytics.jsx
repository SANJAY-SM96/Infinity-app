import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { adminService } from '../../api/adminService';
import { useTheme } from '../../context/ThemeContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiUsers, FiPackage } from 'react-icons/fi';

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
      const [statsRes, chartRes, orderRes, topRes, categoryRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSalesChart({ days: parseInt(timeRange) }),
        adminService.getOrderStats(),
        adminService.getTopProducts(),
        adminService.getCategoryStats()
      ]);

      setStats(statsRes.data.stats);
      setSalesChart(chartRes.data.chartData);
      setOrderStats(orderRes.data.orderStats);
      setTopProducts(topRes.data.topProducts);
      setCategoryStats(categoryRes.data.categoryStats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${textClass}`}>Analytics</h1>
            <p className={textMuted}>Detailed analytics and insights for your store</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer ${
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
        </div>

        {/* Revenue Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} border rounded-xl p-6`}
        >
          <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Revenue Overview</h2>
          {salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="_id" stroke={chartTextColor} fontSize={12} />
                <YAxis stroke={chartTextColor} fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1a1f28' : '#ffffff',
                    border: `1px solid ${isDark ? '#00d4ff' : '#2563EB'}`,
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#000'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#00d4ff" 
                  fillOpacity={1}
                  fill="url(#colorRevenue)" 
                  name="Revenue (₹)"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBg} border rounded-xl p-6`}
          >
            <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Orders by Status</h2>
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

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} border rounded-xl p-6`}
          >
            <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Products by Category</h2>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
                      border: `1px solid ${isDark ? '#00d4ff' : '#2563EB'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
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
          className={`${cardBg} border rounded-xl p-6`}
        >
          <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`flex items-center justify-between p-4 rounded-lg transition ${
                    isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className={`${textClass} font-medium`}>
                        {product.productDetails?.[0]?.title || 'Unknown Product'}
                      </p>
                      <p className={textMuted} style={{ fontSize: '0.875rem' }}>
                        {product.quantity} sold • ₹{product.revenue?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`${isDark ? 'text-cyan-400' : 'text-blue-600'} font-semibold`}>₹{product.revenue?.toFixed(2) || '0.00'}</p>
                    <p className={textMuted} style={{ fontSize: '0.875rem' }}>{product.quantity} units</p>
                  </div>
                </div>
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

