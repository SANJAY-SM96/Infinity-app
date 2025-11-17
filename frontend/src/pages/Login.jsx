import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getApiBaseUrl } from '../utils/constants';
import { handleOAuthCallback } from '../utils/oauthCallbackHandler';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FiMail, FiLock, FiArrowRight, FiStar } from 'react-icons/fi';
import SignUpBranding from '../components/SignUpBranding';
import ThreeDBackground from '../components/auth/ThreeDBackground';
import ThreeDCard from '../components/auth/ThreeDCard';
import FloatingInput from '../components/auth/FloatingInput';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.userType === 'student') {
        navigate('/home/student');
      } else if (user.userType === 'customer') {
        navigate('/home/customer');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }

    handleOAuthCallback({
      isRegistration: false,
      navigate,
      onSuccess: (user, redirectPath) => {
        navigate(redirectPath);
      },
      onError: (error, errorMessage, helpMessage) => {
        console.error('OAuth callback error:', error, errorMessage);
      }
    });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${getApiBaseUrl()}/api/auth/google`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Login successful!');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.userType === 'student') {
        navigate('/home/student');
      } else if (user.userType === 'customer') {
        navigate('/home/customer');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.error);
      setErrors({ email: result.error.includes('email') ? result.error : '', password: result.error.includes('password') ? result.error : '' });
    }
    setLoading(false);
  };

  const socialButtons = [
    { icon: FaGoogle, label: 'Google', onClick: handleGoogleLogin, color: 'text-red-500' },
    { icon: FaGithub, label: 'GitHub', onClick: () => toast('GitHub login coming soon', { icon: '👨‍💻' }), color: '' },
    { icon: FaFacebook, label: 'Facebook', onClick: () => toast('Facebook login coming soon', { icon: '📘' }), color: 'text-blue-600' },
    { icon: FaTwitter, label: 'Twitter', onClick: () => toast('Twitter login coming soon', { icon: '🐦' }), color: 'text-sky-500' },
  ];

  return (
    <div className={`min-h-screen flex relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30'
    } transition-colors duration-500`}>
      {/* 3D Background */}
      <ThreeDBackground isDark={isDark} />

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] relative z-10">
        <SignUpBranding isDark={isDark} />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-[60%] xl:w-[65%] flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          {/* Mobile Branding */}
          <motion.div
            className="lg:hidden mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <img 
                  src="/player.svg" 
                  alt="Infinity Logo" 
                  className="w-12 h-12"
                />
              </motion.div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                INFINITY
              </h1>
            </motion.div>
            <h2 className="text-xl font-bold mb-2 text-white">
              IT Project Marketplace
            </h2>
            <p className="text-sm text-gray-400">
              Welcome back! Please sign in to continue.
            </p>
          </motion.div>

          {/* 3D Form Card */}
          <ThreeDCard isDark={isDark}>
            <div className="bg-gray-800/95 rounded-3xl shadow-2xl border-2 border-gray-700/50 p-8 sm:p-10 md:p-12 lg:p-14 relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className={`absolute inset-0 ${
                  isDark 
                    ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]' 
                    : 'bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.2),transparent_50%)]'
                }`} />
              </div>

              {/* Sparkle effects */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-purple-500"
                  style={{
                    top: `${20 + i * 30}%`,
                    left: `${15 + i * 25}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}

              <div className="relative z-10">
                {/* Header */}
                <motion.div
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2 mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <FiStar className="w-8 h-8 text-purple-500" />
                  </motion.div>
                  <motion.h1
                    className="text-3xl sm:text-4xl font-extrabold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                      Sign In
                    </span>
                  </motion.h1>
                  <motion.p
                    className="text-sm sm:text-base text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Welcome back! Please sign in to continue.
                  </motion.p>
                </motion.div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                  {/* Email Field */}
                  <div className="w-full">
                    <FloatingInput
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      icon={FiMail}
                      error={errors.email}
                      isDark={true}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="w-full">
                    <FloatingInput
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      icon={FiLock}
                      error={errors.password}
                      showPasswordToggle={true}
                      isDark={true}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:via-purple-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-lg relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span className="relative z-10">Signing In...</span>
                      </>
                    ) : (
                      <span className="relative z-10">Sign In</span>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <motion.div
                  className="relative my-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="absolute inset-0 flex items-center border-gray-700">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-4 py-1 rounded-full bg-[#111827] text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </motion.div>

                {/* Social Login Buttons */}
                <motion.div
                  className="grid grid-cols-2 gap-3 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {socialButtons.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.button
                        key={social.label}
                        type="button"
                        onClick={social.onClick}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold border-2 border-gray-700 bg-[#111827] hover:bg-gray-800 text-gray-200 hover:border-gray-600 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                      >
                        <Icon className="w-5 h-5 text-gray-300" />
                        <span className="text-sm">{social.label}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* Sign Up Link */}
                <motion.p
                  className="text-center text-sm text-gray-400 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-purple-500 font-semibold hover:text-purple-400 transition-colors duration-200 relative group"
                  >
                    Sign up
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.p>
              </div>
            </div>
          </ThreeDCard>
        </motion.div>
      </div>
    </div>
  );
}
