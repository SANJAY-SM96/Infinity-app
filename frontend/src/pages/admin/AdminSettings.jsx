import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../api/authService';
import { FiSave, FiUser, FiLock, FiMail, FiBell, FiShield } from 'react-icons/fi';
import { cn } from '../../utils/designSystem';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await authService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${textClass}`}>Settings</h1>
          <p className={`text-sm sm:text-base ${textMuted}`}>Manage your account settings and preferences</p>
        </div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} border rounded-xl p-4 sm:p-5 md:p-6`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
            <FiUser className={cn(isDark ? 'text-cyan-400' : 'text-blue-500', 'w-5 h-5 sm:w-6 sm:h-6')} />
            <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Profile Settings</h2>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4">
            <div>
              <label className={`block ${textMuted} text-xs sm:text-sm mb-1.5 sm:mb-2`}>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-sm sm:text-base`}
              />
            </div>
            <div>
              <label className={`block ${textMuted} text-xs sm:text-sm mb-1.5 sm:mb-2`}>Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className={`w-full px-3 sm:px-4 py-2 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} border ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-lg ${isDark ? 'text-gray-400' : 'text-gray-500'} cursor-not-allowed text-sm sm:text-base`}
              />
            </div>
            <div>
              <label className={`block ${textMuted} text-xs sm:text-sm mb-1.5 sm:mb-2`}>Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-sm sm:text-base`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiSave className="w-4 h-4 sm:w-5 sm:h-5" />
              Save Changes
            </button>
          </form>
        </motion.div>

        {/* Password Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardBg} border rounded-xl p-4 sm:p-5 md:p-6`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
            <FiLock className={cn(isDark ? 'text-pink-400' : 'text-pink-500', 'w-5 h-5 sm:w-6 sm:h-6')} />
            <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
            <div>
              <label className={`block ${textMuted} text-xs sm:text-sm mb-1.5 sm:mb-2`}>Old Password</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                required
                className={`w-full px-3 sm:px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-sm sm:text-base`}
              />
            </div>
            <div>
              <label className={`block ${textMuted} text-xs sm:text-sm mb-1.5 sm:mb-2`}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                className={`w-full px-3 sm:px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-sm sm:text-base`}
              />
            </div>
            <div>
              <label className={`block ${textMuted} text-xs sm:text-sm mb-1.5 sm:mb-2`}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className={`w-full px-3 sm:px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-sm sm:text-base`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiLock className="w-4 h-4 sm:w-5 sm:h-5" />
              Change Password
            </button>
          </form>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardBg} border rounded-xl p-4 sm:p-5 md:p-6`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
            <FiShield className={cn(isDark ? 'text-green-400' : 'text-green-500', 'w-5 h-5 sm:w-6 sm:h-6')} />
            <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Account Information</h2>
          </div>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <span className={textMuted}>Role</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-500">
                {user?.role || 'user'}
              </span>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <span className={textMuted}>Account Created</span>
              <span className={textClass}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <span className={textMuted}>Last Login</span>
              <span className={textClass}>
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

