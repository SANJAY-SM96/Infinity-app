import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiTrendingUp, 
  FiUsers, 
  FiPackage, 
  FiStar,
  FiArrowRight,
  FiCheck,
  FiZap,
  FiShield,
  FiGlobe,
  FiLayers,
  FiBarChart2,
  FiMessageCircle,
  FiCode,
  FiSend,
  FiCpu,
  FiUpload,
  FiDownload,
  FiBookOpen,
  FiShoppingBag,
  FiMessageSquare,
  FiFileText,
  FiExternalLink,
  FiHome,
  FiMail
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedPath, setSelectedPath] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [currentRotatingText, setCurrentRotatingText] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const rotatingTexts = [
    { text: 'Projects...', color: 'from-blue-500 via-purple-500 to-pink-500' },
    { text: 'Repositories...', color: 'from-green-500 via-teal-500 to-cyan-500' },
    { text: 'Shops...', color: 'from-orange-500 via-red-500 to-pink-500' },
    { text: 'Other things...', color: 'from-indigo-500 via-purple-500 to-pink-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRotatingText((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Contact Information
  const whatsappNumber = '919344736773'; // Format: country code + number without +
  const email = 'infinitywebtechnology1@gmail.com';
  const whatsappMessage = encodeURIComponent('Hello! I am interested in your IT projects. Can you help me?');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await productService.getFeatured();
      setFeaturedProjects(response.data.products?.slice(0, 6) || []);
    } catch (error) {
      console.error('Failed to fetch featured projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating icons data
  const floatingIcons = [
    { icon: FiZap, x: '10%', y: '20%', delay: 0 },
    { icon: FiLayers, x: '85%', y: '15%', delay: 0.2 },
    { icon: FiShield, x: '15%', y: '70%', delay: 0.4 },
    { icon: FiGlobe, x: '80%', y: '75%', delay: 0.6 },
    { icon: FiBarChart2, x: '50%', y: '10%', delay: 0.8 },
    { icon: FiPackage, x: '45%', y: '85%', delay: 1 },
  ];

  // Tech Stack data
  const techStack = [
    'React', 'Node.js', 'Python', 'MongoDB', 'AI/ML', 'TypeScript', 'Next.js', 'AWS'
  ];

  // Metrics data
  const metrics = [
    { value: '500+', label: 'IT Projects Available', icon: FiPackage, color: 'text-blue-400' },
    { value: '10K+', label: 'Happy Customers', icon: FiUsers, color: 'text-green-400' },
    { value: '2K+', label: 'Student Sellers', icon: FiBookOpen, color: 'text-yellow-400' },
    { value: '4.9/5', label: 'Customer Rating', icon: FiStar, color: 'text-pink-400' },
  ];

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30';
  const textClass = isDark ? 'text-white' : 'text-gray-900';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: FiHome },
    { id: 'projects', label: 'Projects', icon: FiPackage },
    { id: 'repositories', label: 'Repos', icon: FiCode },
    { id: 'shops', label: 'Shops', icon: FiShoppingBag },
    { id: 'tech', label: 'Tech', icon: FiCode },
    { id: 'metrics', label: 'Stats', icon: FiBarChart2 },
    { id: 'cta', label: 'Get Started', icon: FiArrowRight },
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-hidden transition-colors duration-300`}>
      {/* Sticky Navigation Bar */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 ${
              isDark 
                ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700' 
                : 'bg-white/95 backdrop-blur-xl border-gray-200'
            } border rounded-2xl shadow-2xl px-6 py-3 hidden md:block`}
          >
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isDark
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectForm(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ml-2 ${
                  isDark
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30'
                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                }`}
              >
                <FiFileText size={16} />
                <span>Request Project</span>
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section - Super Home Page with Two Paths */}
      <section id="home" className={`relative min-h-screen flex items-center justify-center overflow-hidden ${bgClass}`}>
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
            animate={{
              x: mousePosition.x * 0.01,
              y: mousePosition.y * 0.01,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-reverse"
            animate={{
              x: mousePosition.x * -0.01,
              y: mousePosition.y * -0.01,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
            animate={{
              x: mousePosition.x * 0.015,
              y: mousePosition.y * 0.015,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        </div>

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                delay: item.delay,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Icon className="w-8 h-8 text-primary/30" />
            </motion.div>
          );
        })}

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IT Project Marketplace
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                For Students & Customers
              </span>
            </motion.h1>
          </motion.div>

          {/* Rotating "Other things..." Text */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <div className="flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold flex-wrap">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Explore</span>
              <div className="relative h-12 sm:h-14 md:h-16 overflow-hidden inline-block" style={{ minWidth: '220px' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRotatingText}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`bg-gradient-to-r ${rotatingTexts[currentRotatingText].color} bg-clip-text text-transparent h-12 sm:h-14 md:h-16 flex items-center whitespace-nowrap absolute inset-0`}
                  >
                    {rotatingTexts[currentRotatingText].text}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Buy ready-made IT projects or sell your own. React, Python, AI/ML, Full-Stack, and more.
          </motion.p>

          {/* Contact Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`mb-12 max-w-2xl mx-auto ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-2xl p-6 shadow-xl`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all group"
              >
                <FiMail size={20} />
                <span className="font-semibold">{email}</span>
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all group"
              >
                <FiMessageSquare size={20} />
                <span className="font-semibold">+91 93447 36773</span>
              </a>
            </div>
          </motion.div>

          {/* Two Path Selection Cards */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Student Path Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden rounded-3xl p-8 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500/30' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'
              } backdrop-blur-xl shadow-2xl cursor-pointer`}
              onClick={() => navigate(isAuthenticated && user?.userType === 'student' ? '/dashboard/student' : '/register?userType=student')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FiUpload className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  I'm a Student
                </h3>
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload and sell your IT projects. Earn money from your React, Python, AI/ML, and web development projects.
                </p>
                <ul className={`space-y-2 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-400" />
                    <span>Upload projects with images & videos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-400" />
                    <span>Set your own prices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-400" />
                    <span>Track sales & earnings</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 group"
                >
                  Start Selling
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>

            {/* Customer Path Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden rounded-3xl p-8 ${
                isDark 
                  ? 'bg-gradient-to-br from-green-900/50 to-teal-900/50 border-2 border-green-500/30' 
                  : 'bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200'
              } backdrop-blur-xl shadow-2xl cursor-pointer`}
              onClick={() => navigate('/products')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FiShoppingBag className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  I'm a Customer
                </h3>
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Browse and buy ready-made IT projects. React, Python, AI/ML, Full-Stack web apps, and more.
                </p>
                <ul className={`space-y-2 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-400" />
                    <span>Browse 500+ IT projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-400" />
                    <span>Instant download after purchase</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-400" />
                    <span>Complete source code included</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 group"
                >
                  Browse Projects
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              Explore All Projects
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProjectForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <FiFileText size={20} />
              Request Custom Project
            </motion.button>
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-primary text-primary dark:text-white font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                Get Started
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: 'reverse', duration: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2 bg-white/50 backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Projects Showcase with 3D Effects */}
      <section id="projects" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* 3D Coding Elements Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute perspective-3d"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                rotateY: [0, 360],
                rotateX: [0, 15, -15, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              <div className="card-3d">
                <div className={`w-16 h-16 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-lg flex items-center justify-center border ${isDark ? 'border-blue-500/30' : 'border-blue-200'} shadow-lg`}>
                  <FiCode className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${textClass}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore our handpicked collection of top IT projects with live demos
            </p>
          </motion.div>

          {loadingProjects ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="perspective-3d"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="card-3d relative group">
                    <ProductCard product={project} />
                    {/* Demo Preview Overlay */}
                    {project.demoUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-20"
                      >
                        <motion.a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-2xl"
                        >
                          <FiExternalLink size={20} />
                          View Live Demo
                        </motion.a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                No featured projects available at the moment
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group"
            >
              View All Projects
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Repositories Section */}
      <section id="repositories" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${textClass}`}>
              <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                GitHub Repositories
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Browse our curated collection of open-source repositories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'React Projects',
                description: 'Modern React applications with hooks, context, and state management',
                stars: '2.5k+',
                language: 'JavaScript',
                color: 'from-blue-500 to-cyan-500',
                icon: FiCode,
                link: '#'
              },
              {
                name: 'Python AI/ML',
                description: 'Machine Learning and AI projects using TensorFlow, PyTorch, and more',
                stars: '1.8k+',
                language: 'Python',
                color: 'from-yellow-500 to-orange-500',
                icon: FiCpu,
                link: '#'
              },
              {
                name: 'Full-Stack Apps',
                description: 'Complete MERN stack applications with authentication and databases',
                stars: '3.2k+',
                language: 'TypeScript',
                color: 'from-purple-500 to-pink-500',
                icon: FiLayers,
                link: '#'
              },
              {
                name: 'Node.js Backend',
                description: 'RESTful APIs, GraphQL servers, and microservices architecture',
                stars: '1.5k+',
                language: 'JavaScript',
                color: 'from-green-500 to-emerald-500',
                icon: FiZap,
                link: '#'
              },
              {
                name: 'Mobile Apps',
                description: 'React Native and Flutter mobile applications',
                stars: '900+',
                language: 'Dart',
                color: 'from-indigo-500 to-blue-500',
                icon: FiGlobe,
                link: '#'
              },
              {
                name: 'DevOps Tools',
                description: 'Docker, Kubernetes, CI/CD pipelines and automation scripts',
                stars: '600+',
                language: 'YAML',
                color: 'from-red-500 to-pink-500',
                icon: FiPackage,
                link: '#'
              }
            ].map((repo, index) => {
              const Icon = repo.icon;
              return (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${repo.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${textClass}`}>{repo.name}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 text-sm`}>
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ⭐ {repo.stars}
                      </span>
                      <span className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {repo.language}
                      </span>
                    </div>
                    <motion.a
                      href={repo.link}
                      whileHover={{ x: 5 }}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      <FiExternalLink size={20} />
                    </motion.a>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group"
            >
              Explore All Repositories
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Shops Section */}
      <section id="shops" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${textClass}`}>
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Featured Shops
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover amazing shops with live previews and demo links
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'E-Commerce Store',
                description: 'Full-featured online shopping platform with cart, checkout, and payment integration',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
                demoUrl: '#',
                tech: ['React', 'Node.js', 'MongoDB'],
                rating: 4.9
              },
              {
                name: 'Food Delivery App',
                description: 'Modern food ordering system with real-time tracking and multiple payment options',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
                demoUrl: '#',
                tech: ['React Native', 'Firebase', 'Stripe'],
                rating: 4.8
              },
              {
                name: 'Social Media Platform',
                description: 'Connect with friends, share posts, and interact with a modern social network',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
                demoUrl: '#',
                tech: ['Next.js', 'GraphQL', 'PostgreSQL'],
                rating: 4.7
              },
              {
                name: 'Task Management',
                description: 'Organize your projects with kanban boards, timelines, and team collaboration',
                image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
                demoUrl: '#',
                tech: ['Vue.js', 'Express', 'MySQL'],
                rating: 4.9
              },
              {
                name: 'Learning Platform',
                description: 'Online courses with video streaming, quizzes, and certificate generation',
                image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
                demoUrl: '#',
                tech: ['Angular', 'Django', 'AWS'],
                rating: 4.8
              },
              {
                name: 'Healthcare Portal',
                description: 'Patient management system with appointments, prescriptions, and telemedicine',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
                demoUrl: '#',
                tech: ['React', 'Spring Boot', 'PostgreSQL'],
                rating: 4.9
              }
            ].map((shop, index) => (
              <motion.div
                key={shop.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <FiStar className="text-yellow-400" size={18} />
                      <span className="font-bold">{shop.rating}</span>
                    </div>
                  </div>
                  {shop.demoUrl && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                    >
                      <motion.a
                        href={shop.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-2xl"
                      >
                        <FiExternalLink size={20} />
                        View Demo
                      </motion.a>
                    </motion.div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${textClass}`}>{shop.name}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 text-sm`}>
                    {shop.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {shop.tech.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group"
            >
              Explore All Shops
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Projects available in these technologies
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg text-xl font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${textClass}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need for your IT project requirements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: FiCode,
                title: 'Custom Project Development',
                description: 'Get tailor-made IT projects built according to your college requirements. We handle React, Python, AI/ML, and Full-Stack projects.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: FiShoppingBag,
                title: 'Ready-Made Projects',
                description: 'Browse and purchase complete IT projects with full source code, documentation, and setup instructions. Instant download after purchase.',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: FiUsers,
                title: 'Project Marketplace',
                description: 'Students can sell their projects and earn money. Customers can buy quality projects at affordable prices in Indian Rupees.',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${isDark ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${textClass}`}>{service.title}</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Icon className={`w-8 h-8 ${metric.color} mx-auto mb-4`} />
                  <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of students and customers buying and selling IT projects
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 group"
            >
              Browse Projects
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register?userType=student')}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300"
            >
              Start Selling
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Floating Contact Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Email Button */}
        <motion.a
          href={`mailto:${email}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-all duration-300 group"
          title={`Email us at ${email}`}
        >
          <FiMail size={24} className="group-hover:scale-110 transition-transform" />
        </motion.a>
        
        {/* WhatsApp Button */}
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 group"
          title="Chat with us on WhatsApp"
        >
          <FiMessageSquare size={28} className="group-hover:scale-110 transition-transform" />
        </motion.a>
      </div>

      {/* Project Request Form Modal */}
      <ProjectRequestForm isOpen={showProjectForm} onClose={() => setShowProjectForm(false)} />
    </div>
  );
}
