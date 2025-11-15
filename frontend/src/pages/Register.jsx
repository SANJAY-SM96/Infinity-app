import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../api/authService';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub, FaFacebook, FaTwitter } from 'react-icons/fa';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiUpload,
  FiShoppingBag
} from 'react-icons/fi';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    
    // Get userType from URL params
    const params = new URLSearchParams(window.location.search);
    const userTypeParam = params.get('userType');
    if (userTypeParam && (userTypeParam === 'student' || userTypeParam === 'customer')) {
      setFormData(prev => ({ ...prev, userType: userTypeParam }));
    }
    
    // Handle Google OAuth callback
    const token = params.get('token');
    if (token) {
      handleGoogleCallback(token);
    }
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAuthenticated, navigate]);

  const handleGoogleCallback = async (token) => {
    try {
      localStorage.setItem('token', token);
      // Fetch user profile with the token
      const response = await authService.getCurrentUser();
      
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful!');
        
        // Navigate based on userType (default to customer for Google auth)
        const userType = response.data.user?.userType || formData.userType || 'customer';
        if (userType === 'student') {
          navigate('/home/student');
        } else if (userType === 'customer') {
          navigate('/home/customer');
        } else {
          navigate('/');
        }
        // Reload to update auth state
        window.location.reload();
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Google auth callback error:', error);
      toast.error('Failed to complete Google authentication');
    }
  };

  const googleLogin = () => {
    // Store userType in sessionStorage so we can use it after Google auth
    sessionStorage.setItem('pendingUserType', formData.userType);
    sessionStorage.setItem('isRegistration', 'true');
    // Redirect to Google OAuth with userType and registration flag
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google?userType=${formData.userType}&registration=true`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.userType);
    
    if (result.success) {
      toast.success('Account created successfully!');
      // Navigate based on userType
      if (formData.userType === 'student') {
        navigate('/home/student');
      } else if (formData.userType === 'customer') {
        navigate('/home/customer');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const features = [
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Quick checkout and delivery'
    },
    {
      icon: FiShield,
      title: 'Secure',
      description: 'Your data is protected'
    },
    {
      icon: FiTrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing always'
    }
  ];

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  const SocialButton = useMemo(() => ({ icon: Icon, label, onClick, className }) => (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type="button"
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold border transition ${className} ${
        isDark 
          ? 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50' 
          : 'border-gray-300 bg-white hover:bg-gray-50'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </motion.button>
  ), [isDark]);

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-hidden relative`}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
            isDark ? 'bg-blue-500' : 'bg-blue-400'
          }`}
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
            isDark ? 'bg-purple-500' : 'bg-purple-400'
          }`}
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
            isDark ? 'bg-pink-500' : 'bg-pink-400'
          }`}
          animate={{
            x: mousePosition.x * 0.015,
            y: mousePosition.y * 0.015,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <motion.div
              style={{ y: heroY }}
              className="space-y-8"
            >
              <div>
                <motion.h1
                  className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Join Infinity
                  </span>
                  <br />
                  <span className={textClass}>Today</span>
                </motion.h1>
                <motion.p
                  className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Create your account and start shopping the latest IT products with exclusive deals and fast delivery.
                </motion.p>
              </div>

              {/* Features */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl ${cardBg} border`}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${textClass}`}>{feature.title}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <motion.div
              className={`${cardBg} border rounded-3xl p-8 shadow-2xl`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="text-center mb-8">
                <motion.h2
                  className="text-3xl md:text-4xl font-extrabold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Create Account
                  </span>
                </motion.h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Join thousands of satisfied customers
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border ${inputBg} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </motion.div>

                {/* User Type Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, userType: 'customer' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.userType === 'customer'
                          ? 'border-primary bg-primary/10'
                          : isDark
                          ? 'border-gray-700 bg-gray-800/50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <FiShoppingBag className={`mx-auto mb-2 ${formData.userType === 'customer' ? 'text-primary' : 'text-gray-400'}`} size={24} />
                        <p className={`font-semibold ${formData.userType === 'customer' ? textClass : 'text-gray-400'}`}>
                          Buy Projects
                        </p>
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, userType: 'student' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.userType === 'student'
                          ? 'border-primary bg-primary/10'
                          : isDark
                          ? 'border-gray-700 bg-gray-800/50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <FiUpload className={`mx-auto mb-2 ${formData.userType === 'student' ? 'text-primary' : 'text-gray-400'}`} size={24} />
                        <p className={`font-semibold ${formData.userType === 'student' ? textClass : 'text-gray-400'}`}>
                          Sell Projects
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {loading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Social login */}
              <div className="mt-8">
                <div className="relative text-center">
                  <span className={`px-3 text-xs uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'} bg-transparent`}>
                    Or continue with
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <SocialButton 
                    icon={FaGoogle} 
                    label="Google" 
                    onClick={googleLogin} 
                    className={isDark ? 'text-cyan-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} 
                  />
                  <SocialButton 
                    icon={FaGithub} 
                    label="GitHub" 
                    onClick={() => toast('GitHub login coming soon', { icon: '👨‍💻' })} 
                    className={isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} 
                  />
                  <SocialButton 
                    icon={FaFacebook} 
                    label="Facebook" 
                    onClick={() => toast('Facebook login coming soon', { icon: '📘' })} 
                    className={isDark ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-700'} 
                  />
                  <SocialButton 
                    icon={FaTwitter} 
                    label="Twitter/X" 
                    onClick={() => toast('Twitter login coming soon', { icon: '🐦' })} 
                    className={isDark ? 'text-sky-200 hover:text-white' : 'text-sky-600 hover:text-sky-700'} 
                  />
                </div>
              </div>

              {/* Login Link */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
