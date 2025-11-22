import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getApiBaseUrl } from '../utils/constants';
import { handleOAuthCallback } from '../utils/oauthCallbackHandler';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub, FaFacebook, FaTwitter, FaShieldAlt, FaRocket, FaCode, FaUsers, FaCheckCircle, FaStar } from 'react-icons/fa';
import { FiMail, FiLock, FiArrowRight, FiZap, FiDatabase, FiFileText } from 'react-icons/fi';
import AuthLayout from '../components/auth/AuthLayout';
import GlassCard from '../components/ui/GlassCard';
import FloatingInput from '../components/auth/FloatingInput';
import SEO from '../components/SEO';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

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
      setTokenLoading(false);
      return;
    }

    const handleTokenAuth = async () => {
      try {
        const handled = await handleOAuthCallback({
          isRegistration: false,
          navigate,
          onSuccess: (user, redirectPath) => {
            setTokenLoading(false);
            navigate(redirectPath);
          },
          onError: (error, errorMessage) => {
            console.error('OAuth callback error:', error, errorMessage);
            setTokenLoading(false);
            if (errorMessage) {
              toast.error(errorMessage);
            }
          }
        });

        if (!handled) {
          setTokenLoading(false);
        }
      } catch (error) {
        console.error('Error handling token authentication:', error);
        setTokenLoading(false);
      }
    };

    handleTokenAuth();
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
    if (!validateForm()) return;

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
      if (result.requiresVerification) {
        toast.error(result.error);
        navigate('/verify-otp', { 
          state: { email: result.email || formData.email } 
        });
        return;
      }
      toast.error(result.error);
      setErrors({
        email: result.error.includes('email') ? result.error : '',
        password: result.error.includes('password') ? result.error : ''
      });
    }
    setLoading(false);
  };

  const socialButtons = [
    { icon: FaGoogle, label: 'Google', onClick: handleGoogleLogin, color: 'text-red-500' },
    { icon: FaGithub, label: 'GitHub', onClick: () => toast('GitHub login coming soon', { icon: '👨‍💻' }), color: '' },
    { icon: FaFacebook, label: 'Facebook', onClick: () => toast('Facebook login coming soon', { icon: '📘' }), color: 'text-blue-600' },
    { icon: FaTwitter, label: 'Twitter', onClick: () => toast('Twitter login coming soon', { icon: '🐦' }), color: 'text-sky-500' },
  ];

  if (tokenLoading) {
    // Match AuthLayout background colors
    const bgColor = isDark ? 'rgb(18, 26, 41)' : 'rgba(249, 250, 251, 0.95)';

    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Authenticating...</p>
        </motion.div>
      </div>
    );
  }

  const features = [
    { icon: FaCode, text: '500+ Verified IT Projects', color: 'text-blue-500' },
    { icon: FiDatabase, text: 'Complete Source Code & Database', color: 'text-green-500' },
    { icon: FiFileText, text: 'Full Documentation Included', color: 'text-purple-500' },
    { icon: FaShieldAlt, text: 'Secure & Trusted Platform', color: 'text-red-500' },
  ];

  const benefits = [
    { icon: FaRocket, title: 'Instant Access', desc: 'Get immediate access to premium IT projects' },
    { icon: FaUsers, title: 'Student Marketplace', desc: 'Buy from verified student developers' },
    { icon: FiZap, title: 'Production Ready', desc: 'All projects are tested and deployment-ready' },
    { icon: FaCheckCircle, title: '24/7 Support', desc: 'Get help whenever you need it' },
  ];

  return (
    <AuthLayout>
      <SEO
        title="Login"
        description="Login to Infinity to access your dashboard, manage projects, and download source code."
      />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - SEO Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-8"
          >
            {/* Main Heading */}
            <div>
              <h1 className={`text-4xl lg:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome Back to{' '}
                <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                  Infinity
                </span>
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                India's leading IT project marketplace. Access 500+ verified projects in React, Python, AI/ML, Full-Stack, and MERN stack technologies.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/60 border border-slate-200'} backdrop-blur-sm`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${feature.color}`} />
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {feature.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Why Choose Infinity?
              </h2>
              <div className="space-y-3">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                        <Icon className={`w-5 h-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {benefit.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {benefit.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30' : 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20'}`}>
              <div className="flex items-center gap-2 mb-3">
                <FaStar className="text-yellow-500 w-5 h-5" />
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  4.8/5 Rating
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Trusted by 10,000+ students and developers. Join India's fastest-growing IT project marketplace.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <div className="w-full lg:max-w-md mx-auto">
            <GlassCard isDark={isDark} className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  Welcome Back!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Sign in to access your projects and dashboard
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <FloatingInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  icon={FiMail}
                  error={errors.email}
                  isDark={isDark}
                  required
                />

                <div className="space-y-1">
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
                    isDark={isDark}
                    required
                  />
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className={`text-xs font-medium hover:underline transition-colors ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                        }`}
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/40'
                    } bg-gradient-to-r from-primary via-primary-light to-accent`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-4 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {socialButtons.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.button
                      key={social.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={social.onClick}
                      className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${isDark
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      title={`Sign in with ${social.label}`}
                    >
                      <Icon className={`w-5 h-5 ${social.color || (isDark ? 'text-slate-200' : 'text-slate-700')}`} />
                    </motion.button>
                  );
                })}
              </div>

              <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className={`font-semibold hover:underline ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                    }`}
                >
                  Create account
                </Link>
              </p>
            </GlassCard>

            {/* Mobile SEO Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:hidden mt-8 space-y-6"
            >
              <div>
                <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Why Choose Infinity?
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                  India's leading IT project marketplace with 500+ verified projects in React, Python, AI/ML, Full-Stack, and MERN stack.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/60 border border-slate-200'}`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${feature.color}`} />
                      <p className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {feature.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
