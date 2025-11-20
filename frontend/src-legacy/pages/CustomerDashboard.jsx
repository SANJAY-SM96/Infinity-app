import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/orderService';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiDownload, 
  FiShoppingBag,
  FiDollarSign,
  FiEdit,
  FiUser,
  FiFileText,
  FiSend,
  FiX
} from 'react-icons/fi';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

export default function CustomerDashboard() {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [requestFormData, setRequestFormData] = useState({
    projectType: '',
    budget: '',
    requirements: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAll({ page: 1, limit: 50 });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setEditMode(false);
    }
  };

  const handleDownload = (orderId, productId) => {
    // In production, this would download the actual project files
    toast.success('Download started!');
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestFormData.projectType || !requestFormData.budget || !requestFormData.requirements) {
      toast.error('Please fill all fields');
      return;
    }
    
    // In production, send to backend
    toast.success('Request submitted! We will contact you soon.');
    setShowRequestForm(false);
    setRequestFormData({
      projectType: '',
      budget: '',
      requirements: ''
    });
  };

  const layoutClasses = getPageLayoutClasses(isDark);

  return (
    <PageLayout
      title={`Welcome, ${user?.name || 'Customer'}! 👋`}
      subtitle="Browse, purchase, and download ready-made IT projects for your business needs"
    >
      {/* Welcome Section */}
      <motion.div
        variants={animationVariants.fadeIn}
        initial="initial"
        animate="animate"
        className={cn(commonClasses.card(isDark), 'mb-6 sm:mb-8 bg-gradient-to-r', isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-blue-50/50 to-indigo-50/50')}
      >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 w-full min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-2 sm:mb-3 leading-tight">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome, {user?.name || 'Customer'}! 👋
                </span>
              </h1>
              <p className={`text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Browse, purchase, and download ready-made IT projects for your business needs
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-white/80'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Purchases</p>
                  <p className={`text-lg sm:text-xl md:text-2xl font-bold ${textClass}`}>{orders.length}</p>
                </div>
                <div className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-white/80'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Spent</p>
                  <p className={`text-lg sm:text-xl md:text-2xl font-bold text-green-500 truncate`}>
                    ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(0)}
                  </p>
                </div>
                <div className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-white/80'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Active</p>
                  <p className={`text-lg sm:text-xl md:text-2xl font-bold text-blue-500`}>
                    {orders.filter(o => o.orderStatus !== 'Delivered').length}
                  </p>
                </div>
              </div>
            </div>
            <Link to="/products" className="w-full lg:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full lg:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base whitespace-nowrap"
              >
                <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">Browse Projects</span>
                <span className="sm:hidden">Browse</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Profile Card */}
          <motion.div
            variants={animationVariants.fadeIn}
            initial="initial"
            animate="animate"
            className={cn(commonClasses.card(isDark), 'md:col-span-2 lg:col-span-1')}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-white w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-bold truncate">{user?.name}</h2>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>{user?.email}</p>
              </div>
            </div>

            {!editMode ? (
              <>
                <div className={`space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div>
                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                    <p className="font-semibold truncate">{user?.name}</p>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className="font-semibold truncate break-all">{user?.email}</p>
                  </div>
                  {user?.phone && (
                    <div>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                      <p className="font-semibold">{user?.phone}</p>
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(true)}
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl text-sm sm:text-base"
                >
                  Edit Profile
                </motion.button>
              </>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn(commonClasses.input(isDark), 'px-3 py-2 text-sm sm:text-base')}
                  placeholder="Name"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={cn(commonClasses.input(isDark), 'px-3 py-2 text-sm sm:text-base')}
                  placeholder="Phone"
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl text-sm sm:text-base"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={animationVariants.fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className={commonClasses.card(isDark)}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Purchase Stats</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Purchases</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{orders.length}</p>
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">
                  ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={animationVariants.fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className={commonClasses.card(isDark)}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  Browse Projects
                </motion.button>
              </Link>
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FiPackage className="w-4 h-4 sm:w-5 sm:h-5" />
                  View Cart
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setShowRequestForm(true)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/10 transition text-sm sm:text-base"
              >
                <FiFileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Request Whole Project
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(commonClasses.card(isDark), 'max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 p-4 sm:p-5 md:p-6')}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate pr-2">Request to Buy Whole Project</h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                    Project Type / Technology *
                  </label>
                  <select
                    value={requestFormData.projectType}
                    onChange={(e) => setRequestFormData({ ...requestFormData, projectType: e.target.value })}
                    required
                    className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                  >
                    <option value="">Select Project Type</option>
                    <option value="React Projects">React Projects</option>
                    <option value="Python Projects">Python Projects</option>
                    <option value="AI/ML Projects">AI/ML Projects</option>
                    <option value="Full-Stack Web Apps">Full-Stack Web Apps</option>
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="MEAN Stack">MEAN Stack</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                    Budget Range (₹) *
                  </label>
                  <input
                    type="text"
                    value={requestFormData.budget}
                    onChange={(e) => setRequestFormData({ ...requestFormData, budget: e.target.value })}
                    required
                    className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                    placeholder="5000 - 10000 or Fixed: 8000"
                  />
                </div>

                <div>
                  <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                    Requirements / What you need *
                  </label>
                  <textarea
                    value={requestFormData.requirements}
                    onChange={(e) => setRequestFormData({ ...requestFormData, requirements: e.target.value })}
                    required
                    rows={5}
                    className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                    placeholder="Describe what kind of project you want to buy. Include features, functionality, and any specific requirements..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                    Submit Request
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Orders / Purchased Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={commonClasses.card(isDark)}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Purchases</h2>

          {loading ? (
            <Loader />
          ) : orders.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`p-3 sm:p-4 rounded-xl border ${
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <Link 
                      to={`/dashboard/orders/${order._id}`}
                      className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
                    >
                      <p className="font-semibold text-sm sm:text-base">Order #{order._id.slice(-8)}</p>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-primary font-bold text-sm sm:text-base">₹{order.total?.toFixed(2)}</p>
                      <span className={`px-2 sm:px-3 py-1 rounded text-xs font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-700/30 dark:bg-gray-700/30 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm sm:text-base truncate">{item.name || item.title}</p>
                            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload(order._id, item.product || item._id)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                            Download
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
                <FiPackage className="mx-auto mb-4 text-gray-400 w-10 h-10 sm:w-12 sm:h-12" />
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                No purchases yet. Start browsing projects!
              </p>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl text-sm sm:text-base"
                >
                  Browse Projects
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
    </PageLayout>
  );
}

