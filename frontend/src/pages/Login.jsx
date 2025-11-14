import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FiMail, FiLock, FiArrowRight, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
  if (isAuthenticated) navigate('/');
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error);
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
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-hidden relative transition-colors duration-300`}>
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
                    Welcome Back
                  </span>
                  <br />
                  <span className={textClass}>to Infinity</span>
                </motion.h1>
                <motion.p
                  className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Sign in to continue shopping the latest IT products with exclusive deals and fast delivery.
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

          {/* Right Side - Login Form */}
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
                    Sign In
                  </span>
                </motion.h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Welcome back. Let's continue your journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
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
                      className={`w-full ${inputBg} pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
                  />
                </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-semibold ${textClass}`}>Password</label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:text-blue-600">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`w-full ${inputBg} pl-12 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
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
                  transition={{ delay: 0.5 }}
                >
                  {loading ? (
                    'Logging in...'
                  ) : (
                    <>
                      Sign In
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
                  <SocialButton icon={FaGoogle} label="Google" onClick={googleLogin} className={isDark ? 'text-cyan-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} />
                  <SocialButton icon={FaGithub} label="GitHub" onClick={() => toast('GitHub login coming soon', { icon: '👨‍💻' })} className={isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-gray-900'} />
                  <SocialButton icon={FaFacebook} label="Facebook" onClick={() => toast('Facebook login coming soon', { icon: '📘' })} className={isDark ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-700'} />
                  <SocialButton icon={FaTwitter} label="Twitter/X" onClick={() => toast('Twitter login coming soon', { icon: '🐦' })} className={isDark ? 'text-sky-200 hover:text-white' : 'text-sky-600 hover:text-sky-700'} />
                </div>
              </div>

              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-8`}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:text-blue-600 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
