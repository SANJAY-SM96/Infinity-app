import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getApiBaseUrl, REGEX, ERROR_MESSAGES } from '../utils/constants';
import { handleOAuthCallback } from '../utils/oauthCallbackHandler';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub, FaFacebook, FaTwitter, FaShieldAlt, FaRocket, FaCode, FaUsers, FaCheckCircle, FaStar, FaGraduationCap } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiArrowRight, FiZap, FiDatabase, FiFileText, FiTrendingUp } from 'react-icons/fi';
import AuthLayout from '../components/auth/AuthLayout';
import GlassCard from '../components/ui/GlassCard';
import FloatingInput from '../components/auth/FloatingInput';
import RoleSelector from '../components/RoleSelector';
import SEO from '../components/SEO';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.userType === 'student') navigate('/home/student');
      else if (user.userType === 'customer') navigate('/home/customer');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const userTypeParam = params.get('userType');
    if (userTypeParam && ['student', 'customer'].includes(userTypeParam)) {
      setFormData(prev => ({ ...prev, userType: userTypeParam }));
    }

    handleOAuthCallback({
      isRegistration: true,
      navigate,
      onSuccess: (user, redirectPath) => {
        window.location.href = redirectPath;
      },
      onError: (error, errorMessage) => {
        console.error('OAuth callback error:', error, errorMessage);
      }
    });
  }, [isAuthenticated, navigate]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = ERROR_MESSAGES.REQUIRED_FIELD;
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = ERROR_MESSAGES.REQUIRED_FIELD;
        else if (!REGEX.email.test(value)) error = ERROR_MESSAGES.INVALID_EMAIL;
        break;
      case 'password':
        if (!value) error = ERROR_MESSAGES.REQUIRED_FIELD;
        else if (value.length < 6) error = ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
        break;
      case 'confirmPassword':
        if (!value) error = ERROR_MESSAGES.REQUIRED_FIELD;
        else if (value !== formData.password) error = ERROR_MESSAGES.PASSWORD_MISMATCH;
        break;

      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: ERROR_MESSAGES.PASSWORD_MISMATCH }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, userType: role }));
    setErrors(prev => ({ ...prev, userType: '' }));
  };

  const handleGoogleLogin = () => {
    sessionStorage.setItem('pendingUserType', formData.userType);
    sessionStorage.setItem('isRegistration', 'true');
    window.location.href = `${getApiBaseUrl()}/api/auth/google?userType=${formData.userType}&registration=true`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.userType
      );

      if (result.success) {
        toast.success('Account created successfully! Please verify your email.');
        navigate('/verify-otp', {
          state: { email: formData.email.trim().toLowerCase(), userType: formData.userType }
        });
      } else {
        const errorMessage = result.error || 'Registration failed.';
        if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already')) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialButtons = [
    { icon: FaGoogle, label: 'Google', onClick: handleGoogleLogin, color: 'text-red-500' },
    { icon: FaGithub, label: 'GitHub', onClick: () => toast('GitHub login coming soon', { icon: '👨‍💻' }), color: '' },
    { icon: FaFacebook, label: 'Facebook', onClick: () => toast('Facebook login coming soon', { icon: '📘' }), color: 'text-blue-600' },
    { icon: FaTwitter, label: 'Twitter', onClick: () => toast('Twitter login coming soon', { icon: '🐦' }), color: 'text-sky-500' },
  ];

  const studentFeatures = [
    { icon: FiTrendingUp, text: 'Publish Your Projects', color: 'text-green-500' },
    { icon: FaGraduationCap, text: 'Monetize College Projects', color: 'text-blue-500' },
    { icon: FaRocket, text: 'Earn Passive Income', color: 'text-purple-500' },
    { icon: FaUsers, text: 'Reach 10,000+ Buyers', color: 'text-pink-500' },
  ];

  const customerFeatures = [
    { icon: FaCode, text: '500+ Verified Projects', color: 'text-blue-500' },
    { icon: FiDatabase, text: 'Complete Source Code', color: 'text-green-500' },
    { icon: FiFileText, text: 'Full Documentation', color: 'text-purple-500' },
    { icon: FaShieldAlt, text: 'Secure & Trusted', color: 'text-red-500' },
  ];

  const benefits = [
    { icon: FaRocket, title: 'Quick Setup', desc: 'Get started in minutes with instant access' },
    { icon: FaCheckCircle, title: 'Verified Projects', desc: 'All projects are tested and verified' },
    { icon: FiZap, title: 'Production Ready', desc: 'Deploy immediately with complete code' },
    { icon: FaStar, title: 'Best Support', desc: '24/7 customer support for all users' },
  ];

  return (
    <AuthLayout>
      <SEO
        title="Register"
        description="Create an account on Infinity to browse or publish IT projects. Join our community of developers and students."
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
                Join{' '}
                <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                  Infinity
                </span>
                {' '}Today
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                India's #1 IT project marketplace. Join 10,000+ students and developers browsing and publishing verified IT projects with complete source code, documentation, and database.
              </p>
            </div>

            {/* Role-based Features */}
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formData.userType === 'student' ? 'For Students' : 'For Customers'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(formData.userType === 'student' ? studentFeatures : customerFeatures).map((feature, idx) => {
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
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Why Join Infinity?
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
                <FaUsers className="text-primary-500 w-5 h-5" />
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  10,000+ Active Users
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Join India's fastest-growing IT project marketplace. Start buying or selling projects today!
              </p>
            </div>
          </motion.div>

          {/* Right Column - Registration Form */}
          <div className="w-full lg:max-w-md mx-auto">
            <GlassCard isDark={isDark} className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  Join Infinity
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Create your account and start your journey
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  icon={FiUser}
                  error={errors.name}
                  isDark={isDark}
                  required
                />

                <FloatingInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={FiMail}
                  error={errors.email}
                  isDark={isDark}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    icon={FiLock}
                    error={errors.password}
                    showPasswordToggle={true}
                    isDark={isDark}
                    required
                  />
                  <FloatingInput
                    label="Confirm"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm"
                    icon={FiLock}
                    error={errors.confirmPassword}
                    showPasswordToggle={true}
                    isDark={isDark}
                    required
                  />
                </div>

                <div className="py-2">
                  <RoleSelector
                    selectedRole={formData.userType}
                    onSelect={handleRoleSelect}
                    isDark={isDark}
                  />
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="relative my-6">
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
                      title={`Sign up with ${social.label}`}
                    >
                      <Icon className={`w-5 h-5 ${social.color || (isDark ? 'text-slate-200' : 'text-slate-700')}`} />
                    </motion.button>
                  );
                })}
              </div>

              <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className={`font-semibold hover:underline ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                    }`}
                >
                  Sign in
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
                  Why Join Infinity?
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                  India's #1 IT project marketplace with 500+ verified projects. Join 10,000+ students and developers.
                </p>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formData.userType === 'student' ? 'For Students' : 'For Customers'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(formData.userType === 'student' ? studentFeatures : customerFeatures).map((feature, idx) => {
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
