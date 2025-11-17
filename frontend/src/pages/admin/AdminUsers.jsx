import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { adminService } from '../../api/adminService';
import { useTheme } from '../../context/ThemeContext';
import { FiSearch, FiUser, FiMail, FiCalendar, FiShield, FiTrash2, FiXCircle, FiUnlock, FiPackage, FiEdit, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [planData, setPlanData] = useState({ plan: 'free', status: 'active', autoRenew: false });
  const { isDark } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Re-filter when search query changes (client-side filtering)
    if (allUsers.length > 0) {
      if (searchQuery) {
        const filtered = allUsers.filter(user =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setUsers(filtered);
      } else {
        setUsers(allUsers);
      }
    }
  }, [searchQuery, allUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      const fetchedUsers = response.data.users || [];
      setAllUsers(fetchedUsers);
      
      let filteredUsers = fetchedUsers;
      if (searchQuery) {
        filteredUsers = fetchedUsers.filter(user =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;

    try {
      await adminService.banUser(selectedUser._id, banReason);
      toast.success('User banned successfully');
      setShowBanModal(false);
      setBanReason('');
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error(error.response?.data?.message || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await adminService.unbanUser(userId);
      toast.success('User unbanned successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error(error.response?.data?.message || 'Failed to unban user');
    }
  };

  const handleRemoveFromPlan = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user from their plan?')) {
      return;
    }

    try {
      await adminService.removeUserFromPlan(userId);
      toast.success('User removed from plan successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to remove user from plan:', error);
      toast.error(error.response?.data?.message || 'Failed to remove user from plan');
    }
  };

  const handleUpdatePlan = async () => {
    if (!selectedUser) return;

    try {
      await adminService.updateUserPlan(selectedUser._id, planData);
      toast.success('User plan updated successfully');
      setShowPlanModal(false);
      setPlanData({ plan: 'free', status: 'active', autoRenew: false });
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user plan:', error);
      toast.error(error.response?.data?.message || 'Failed to update user plan');
    }
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Users Management
            </span>
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-white/60' : 'text-gray-600'}`}>View and manage all registered users (Students & Customers)</p>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
              isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary/50' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary/50'
            }`}
          />
        </div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${isDark ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/40 transition`}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-sm sm:text-base truncate`}>{user.name}</p>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm truncate`}>{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>Role</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer transition ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-cyan-500/20 text-cyan-500'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>Type</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.userType === 'student' ? 'bg-blue-500/20 text-blue-500' :
                    user.userType === 'customer' ? 'bg-green-500/20 text-green-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {user.userType || 'customer'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>Joined</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.subscription && (
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>Plan</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.subscription.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-500' :
                      user.subscription.plan === 'premium' ? 'bg-yellow-500/20 text-yellow-500' :
                      user.subscription.plan === 'basic' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {user.subscription.plan || 'free'}
                    </span>
                  </div>
                )}
                {user.isBanned && (
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 text-xs font-medium">BANNED</span>
                    {user.banReason && (
                      <span className="text-red-400 text-xs" title={user.banReason}>
                        {user.banReason.substring(0, 20)}...
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-wrap gap-2">
                {user.isBanned ? (
                  <button
                    onClick={() => handleUnbanUser(user._id)}
                    className="flex-1 px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition text-xs font-medium"
                  >
                    <FiUnlock className="inline mr-1" size={14} />
                    Unban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowBanModal(true);
                    }}
                    className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-xs font-medium"
                    disabled={user.role === 'admin'}
                  >
                    <FiXCircle className="inline mr-1" size={14} />
                    Ban
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setPlanData({
                      plan: user.subscription?.plan || 'free',
                      status: user.subscription?.status || 'active',
                      autoRenew: user.subscription?.autoRenew || false
                    });
                    setShowPlanModal(true);
                  }}
                  className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition text-xs font-medium"
                >
                  <FiPackage className="inline mr-1" size={14} />
                  Plan
                </button>
                {user.subscription?.plan && user.subscription.plan !== 'free' && (
                  <button
                    onClick={() => handleRemoveFromPlan(user._id)}
                    className="px-3 py-1.5 bg-orange-500/20 text-orange-500 rounded-lg hover:bg-orange-500/30 transition text-xs font-medium"
                  >
                    Remove Plan
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user._id, user.name)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-xs font-medium"
                  disabled={user.role === 'admin'}
                >
                  <FiTrash2 className="inline mr-1" size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ban Modal */}
        <AnimatePresence>
          {showBanModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowBanModal(false);
                setBanReason('');
                setSelectedUser(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                    Ban User: {selectedUser.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowBanModal(false);
                      setBanReason('');
                      setSelectedUser(null);
                    }}
                    className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Ban Reason
                    </label>
                    <textarea
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Enter reason for banning this user..."
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleBanUser}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                    >
                      Ban User
                    </button>
                    <button
                      onClick={() => {
                        setShowBanModal(false);
                        setBanReason('');
                        setSelectedUser(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-500 rounded-lg hover:bg-gray-500/30 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan Modal */}
        <AnimatePresence>
          {showPlanModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowPlanModal(false);
                setPlanData({ plan: 'free', status: 'active', autoRenew: false });
                setSelectedUser(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                    Update Plan: {selectedUser.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPlanModal(false);
                      setPlanData({ plan: 'free', status: 'active', autoRenew: false });
                      setSelectedUser(null);
                    }}
                    className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Plan
                    </label>
                    <select
                      value={planData.plan}
                      onChange={(e) => setPlanData({ ...planData, plan: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={planData.status}
                      onChange={(e) => setPlanData({ ...planData, status: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark 
                          ? 'bg-gray-700/50 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoRenew"
                      checked={planData.autoRenew}
                      onChange={(e) => setPlanData({ ...planData, autoRenew: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="autoRenew" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Auto Renew
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdatePlan}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                    >
                      Update Plan
                    </button>
                    <button
                      onClick={() => {
                        setShowPlanModal(false);
                        setPlanData({ plan: 'free', status: 'active', autoRenew: false });
                        setSelectedUser(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-500 rounded-lg hover:bg-gray-500/30 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {users.length === 0 && !loading && (
          <div className="py-12 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No users found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

