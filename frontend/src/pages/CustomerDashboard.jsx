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

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Customer Dashboard
            </span>
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse, purchase, and download IT projects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBg} border rounded-2xl p-6 lg:col-span-1`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
              </div>
            </div>

            {!editMode ? (
              <>
                <div className={`space-y-3 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                    <p className="font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  {user?.phone && (
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                      <p className="font-semibold">{user?.phone}</p>
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl"
                >
                  Edit Profile
                </motion.button>
              </>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full ${inputBg} px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  placeholder="Name"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full ${inputBg} px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  placeholder="Phone"
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBg} border rounded-2xl p-6`}
          >
            <h3 className="text-lg font-semibold mb-4">Purchase Stats</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Purchases</p>
                <p className="text-3xl font-bold text-primary">{orders.length}</p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} border rounded-2xl p-6`}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center gap-2"
                >
                  <FiShoppingBag />
                  Browse Projects
                </motion.button>
              </Link>
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl flex items-center gap-2"
                >
                  <FiPackage />
                  View Cart
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setShowRequestForm(true)}
                className="w-full px-4 py-3 border border-primary text-primary font-bold rounded-xl flex items-center gap-2 hover:bg-primary/10 transition"
              >
                <FiFileText />
                Request Whole Project
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${cardBg} border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Request to Buy Whole Project</h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Project Type / Technology *
                  </label>
                  <select
                    value={requestFormData.projectType}
                    onChange={(e) => setRequestFormData({ ...requestFormData, projectType: e.target.value })}
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
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
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Budget Range (₹) *
                  </label>
                  <input
                    type="text"
                    value={requestFormData.budget}
                    onChange={(e) => setRequestFormData({ ...requestFormData, budget: e.target.value })}
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="5000 - 10000 or Fixed: 8000"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Requirements / What you need *
                  </label>
                  <textarea
                    value={requestFormData.requirements}
                    onChange={(e) => setRequestFormData({ ...requestFormData, requirements: e.target.value })}
                    required
                    rows={6}
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="Describe what kind of project you want to buy. Include features, functionality, and any specific requirements..."
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <FiSend />
                    Submit Request
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl"
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
          className={`${cardBg} border rounded-2xl p-6`}
        >
          <h2 className="text-2xl font-bold mb-6">My Purchases</h2>

          {loading ? (
            <Loader />
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">₹{order.total?.toFixed(2)}</p>
                      <span className={`px-3 py-1 rounded text-xs font-bold ${
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
                          className="flex justify-between items-center p-3 bg-gray-700/30 dark:bg-gray-700/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{item.name || item.title}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload(order._id, item.product || item._id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg flex items-center gap-2"
                          >
                            <FiDownload />
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
            <div className="text-center py-12">
              <FiPackage className="mx-auto mb-4 text-gray-400" size={48} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No purchases yet. Start browsing projects!
              </p>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl"
                >
                  Browse Projects
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

