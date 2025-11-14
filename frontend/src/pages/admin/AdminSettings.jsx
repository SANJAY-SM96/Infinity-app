import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import { FiSave, FiUser, FiLock, FiMail, FiBell, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user, updateProfile } = useAuth();
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

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account settings and preferences</p>
        </div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-light to-dark-lighter rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiUser className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-2 bg-dark/50 border border-primary/20 rounded-lg text-white/60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSave size={20} />
              Save Changes
            </button>
          </form>
        </motion.div>

        {/* Password Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-dark-light to-dark-lighter rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiLock className="text-pink-400" size={24} />
            <h2 className="text-xl font-bold text-white">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Old Password</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                required
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiLock size={20} />
              Change Password
            </button>
          </form>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-dark-light to-dark-lighter rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiShield className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Account Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-dark/50">
              <span className="text-white/60">Role</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                {user?.role || 'user'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-dark/50">
              <span className="text-white/60">Account Created</span>
              <span className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-dark/50">
              <span className="text-white/60">Last Login</span>
              <span className="text-white">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

