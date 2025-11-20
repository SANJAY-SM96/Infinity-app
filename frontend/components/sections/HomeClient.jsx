'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
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
  FiMail,
  FiInstagram,
  FiDatabase,
  FiServer,
  FiCloud,
  FiHeadphones,
  FiSearch,
  FiAward,
  FiSettings,
  FiActivity
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { generateGeneralImageAlt } from '../../utils/imageOptimizer';
import { getHomeSectionNavItems } from '../../utils/navigation';
import ProjectRequestForm from '../../components/ProjectRequestForm';
import { productService } from '../../lib/api/productService';
import ProductCard from '../../components/ProductCard';
import AIChatbot from '../../components/AIChatbot';
import { BeamCircle } from '../../components/animations/beam-circle';
import { ParticleBackground } from '../../components/animations/ParticleBackground';

export default function HomeClient() {
  const router = useRouter();
  // Mock auth and theme for now if contexts are not ready
  const { isAuthenticated, user } = useAuth() || { isAuthenticated: false, user: null };
  const { isDark } = useTheme() || { isDark: false };
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [currentRotatingText, setCurrentRotatingText] = useState(0);
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [beamCircleSize, setBeamCircleSize] = useState(400);
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
      // Only log error in development, don't show to users
      if (process.env.NODE_ENV === 'development') {
        if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
          console.warn('Backend server is not running. Please start the backend server on port 5000.');
        } else {
          console.error('Failed to fetch featured projects:', error);
        }
      }
      // Set empty array so UI doesn't break
      setFeaturedProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowStickyNav(currentScrollY > 300);

      // Always show floating buttons - never hide them
      setShowFloatingButtons(true);

      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Responsive beam circle size
  useEffect(() => {
    const updateBeamCircleSize = () => {
      if (window.innerWidth >= 1280) {
        setBeamCircleSize(600);
      } else if (window.innerWidth >= 1024) {
        setBeamCircleSize(500);
      } else {
        setBeamCircleSize(400);
      }
    };

    updateBeamCircleSize();
    window.addEventListener('resize', updateBeamCircleSize);
    return () => window.removeEventListener('resize', updateBeamCircleSize);
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

  // Dynamic theme-based styling - matching About/Contact pages
  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-900';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic navigation items for home page sections
  const iconMap = {
    'home': FiHome,
    'projects': FiPackage,
    'repositories': FiCode,
    'shops': FiShoppingBag,
    'tech': FiCode,
    'metrics': FiBarChart2,
    'cta': FiArrowRight,
  };

  const navItems = useMemo(() =>
    getHomeSectionNavItems(user, isAuthenticated, iconMap),
    [user, isAuthenticated]
  );


  return (
    <main className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-500`}>
      {/* Sticky Navigation Bar */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 backdrop-blur-xl border rounded-2xl shadow-2xl px-6 py-3 hidden md:block transition-colors duration-300 ${isDark
              ? 'bg-slate-800/95 border-slate-700'
              : 'bg-white/95 border-slate-200'
              }`}
          >
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => {
                const Icon = item.icon;
                // Style "Get Started" differently as plain text
                if (item.id === 'cta') {
                  return (
                    <React.Fragment key={item.id}>
                      <FiArrowRight
                        size={16}
                        className={`mx-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection(item.sectionId || item.id)}
                        className={`px-2 py-2 text-sm font-medium transition-all ${isDark
                          ? 'text-slate-300 hover:text-primary'
                          : 'text-slate-700 hover:text-primary'
                          }`}
                      >
                        <span>{item.label}</span>
                      </motion.button>
                    </React.Fragment>
                  );
                }
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.sectionId || item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${isDark
                      ? 'text-slate-400 hover:text-primary hover:bg-primary/10'
                      : 'text-slate-600 hover:text-primary hover:bg-primary/10'
                      }`}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectForm(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ml-2 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 whitespace-nowrap"
              >
                <FiFileText size={16} />
                <span>Request Project</span>
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className={`relative min-h-screen flex items-center ${isDark ? 'bg-slate-900' : 'bg-white'} transition-all duration-300`}>
        <ParticleBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 sm:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Headline */}
              <div className="mb-2">
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${isDark
                  ? 'from-cyan-400 via-purple-500 to-emerald-400'
                  : 'from-cyan-600 via-purple-600 to-emerald-600'
                  }`}
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 1.1 }}
                >
                  Infinity Web Technology
                </h1>
              </div>

              {/* Sub-headline */}
              <motion.h4
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Buy & Sell IT Projects
                <br />
                With Full Source Code
              </motion.h4>

              {/* Body Text */}
              <motion.p
                className={`text-lg sm:text-xl md:text-2xl leading-relaxed max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                India's leading IT project marketplace. Browse 500+ ready-made projects. Get complete source code. Sell your projects. Start today.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/products')}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300 group"
                >
                  <span>Browse Projects</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register?userType=student')}
                  className={`flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-lg transition-all duration-300 ${isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                  Start Selling
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Section - Beam Circle Animation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-center justify-end py-12 lg:py-0 lg:pr-8 xl:pr-12"
            >
              {/* Beam Circle Component - Responsive Size */}
              <div className="relative z-10 flex items-center justify-center lg:justify-end">
                <BeamCircle
                  size={beamCircleSize}
                  centerIcon={
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'
                        } flex items-center justify-center shadow-xl`}>
                        <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'
                          } flex items-center justify-center`}>
                          <FiCode className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`} size={32} />
                        </div>
                      </div>
                    </div>
                  }
                  orbits={[
                    {
                      id: 1,
                      radiusFactor: 0.25,
                      speed: 10,
                      icon: <FiTrendingUp className="text-blue-400" size={32} />,
                      iconSize: 32,
                      orbitColor: 'rgba(59, 130, 246, 0.3)',
                      orbitThickness: 2,
                    },
                    {
                      id: 2,
                      radiusFactor: 0.4,
                      speed: 14,
                      icon: <FiLayers className="text-green-400" size={32} />,
                      iconSize: 32,
                      orbitColor: 'rgba(34, 197, 94, 0.3)',
                      orbitThickness: 2,
                      },
                    {
                      id: 3,
                      radiusFactor: 0.55,
                      speed: 18,
                      icon: <FiCpu className="text-purple-400" size={32} />,
                      iconSize: 32,
                      orbitColor: 'rgba(168, 85, 247, 0.3)',
                      orbitThickness: 2,
                    },
                    {
                      id: 4,
                      radiusFactor: 0.7,
                      speed: 22,
                      icon: <FiZap className="text-yellow-400" size={32} />,
                      iconSize: 32,
                      orbitColor: 'rgba(234, 179, 8, 0.3)',
                      orbitThickness: 2,
                    },
                    {
                      id: 5,
                      radiusFactor: 0.85,
                      speed: 26,
                      icon: <FiDatabase className="text-orange-400" size={28} />,
                      iconSize: 28,
                      orbitColor: 'rgba(251, 146, 60, 0.3)',
                      orbitThickness: 2,
                    },
                  ]}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase with Glassy Design */}
      <section id="projects" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-white via-indigo-50/30 to-primary-50/20'
        }`}>
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${isDark ? 'bg-primary-light' : 'bg-primary'
              }`}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${isDark ? 'bg-accent' : 'bg-accent-light'
              }`}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
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
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 shadow-lg">
                  <FiCode className="text-blue-600" size={24} />
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
            className="text-center mb-8 sm:mb-12 relative z-10"
          >
            <motion.div
              className="inline-block mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-3 sm:mb-4 px-2">
                <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
            </motion.div>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
              Explore our handpicked collection of top IT projects with live demos
            </p>
            {/* Urgency Banner - Glassy Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-xl ${isDark
                ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30'
                : 'bg-gradient-to-r from-orange-100/80 to-red-100/80 border-orange-300/50'
                }`}
            >
              <FiTrendingUp className="text-orange-500" size={20} />
              <span className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                🔥 Trending Now - Limited Time Offers
              </span>
            </motion.div>
          </motion.div>

          {loadingProjects ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 relative z-10">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="relative"
                >
                  <div className="relative group">
                    <ProductCard product={project} />
                    {/* Glassy Demo Preview Overlay */}
                    {project.demoUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-3xl flex items-center justify-center z-20"
                      >
                        <motion.a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="px-6 py-3 bg-white/95 backdrop-blur-xl border border-white/30 text-slate-900 font-bold rounded-2xl flex items-center gap-2 shadow-2xl"
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
              <p className="text-slate-600 text-lg">
                No featured projects available at the moment
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center relative z-10"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="px-8 py-4 bg-gradient-to-r from-primary via-primary-light to-accent text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto group backdrop-blur-sm border border-white/20"
              style={{
                boxShadow: '0 4px 15px 0 rgba(79, 70, 229, 0.5)'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-light via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="relative z-10">View All Projects</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-primary-50/20'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                About Us
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Infinity Web Technology is India's premier IT project marketplace. We connect students, developers, and businesses with quality IT projects and full source code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${isDark ? 'bg-slate-800/80' : 'bg-white/80'} backdrop-blur-xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-2xl p-6 sm:p-8 md:p-10 max-w-4xl mx-auto`}
          >
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-4`}>
              We're a trusted marketplace where students can monetize their IT projects and customers can buy production-ready code instantly.
            </p>
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Every project includes complete source code, documentation, database files, and setup guides. All verified. All trusted. All in Indian Rupees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-white to-slate-50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Why Choose Us
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Trusted by 10K+ customers. Built for speed and reliability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiShield,
                title: 'Verified Projects',
                description: 'All projects go through quality checks. Complete source code. Clean documentation.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: FiZap,
                title: 'Instant Download',
                description: 'Get your project files immediately after purchase. No waiting. No delays.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: FiUsers,
                title: 'Lifetime Support',
                description: 'Free support for all purchases. Get help when you need it. Always.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: FiGlobe,
                title: 'Indian Pricing',
                description: 'All prices in Indian Rupees. Easy payments via UPI, cards, and bank transfer.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: FiTrendingUp,
                title: '500+ Projects',
                description: 'React, Python, AI/ML, Full-Stack. Latest technologies. Updated regularly.',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                icon: FiStar,
                title: '4.9/5 Rating',
                description: '10K+ happy customers. Thousands of successful deliveries. Proven track record.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed`}>
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Request Form Modal */}
      <ProjectRequestForm isOpen={showProjectForm} onClose={() => setShowProjectForm(false)} />

      {/* AI Chatbot */}
      <AIChatbot />
    </main>
  );
}
