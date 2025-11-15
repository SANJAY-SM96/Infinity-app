import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { adminService } from '../../api/adminService';
import { useTheme } from '../../context/ThemeContext';
import { FiSearch, FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      let filteredUsers = response.data.users || [];
      
      if (searchQuery) {
        filteredUsers = filteredUsers.filter(user =>
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
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Users Management
            </span>
          </h1>
          <p className={isDark ? 'text-white/60' : 'text-gray-600'}>View and manage all registered users (Students & Customers)</p>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${isDark ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border rounded-xl p-6 hover:border-primary/40 transition`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center">
                  <FiUser className="text-white" size={20} />
                </div>
                <div>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{user.name}</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>Role</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-cyan-500/20 text-cyan-500'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>Joined</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '0.875rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {users.length === 0 && !loading && (
          <div className="py-12 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No users found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

