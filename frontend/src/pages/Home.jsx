import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  FiInstagram
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { generateGeneralImageAlt } from '../utils/imageOptimizer';
import { BASE_URL, generateOrganizationSchema, generateWebSiteSchema, generateFAQSchema, combineSchemas } from '../utils/seoConfig';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import AIChatbot from '../components/AIChatbot';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [currentRotatingText, setCurrentRotatingText] = useState(0);
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const rotatingTexts = [
    { text: 'Projects...', color: 'from-blue-500 via-purple-500 to-pink-500' },
    { text: 'Repositories...', color: 'from-green-500 via-teal-500 to-cyan-500' },
    { text: 'Shops...', color: 'from-orange-500 via-red-500 to-pink-500' },
    { text: 'Other things...', color: 'from-indigo-500 via-purple-500 to-pink-500' },
  ];

  // Floating pastel gradient icons for left/right sides
  const floatingIconsLeft = [
    { icon: FiShield, x: '10%', y: '20%', delay: 0, gradient: 'from-blue-200 to-cyan-200' },
    { icon: FiLayers, x: '8%', y: '50%', delay: 0.5, gradient: 'from-pink-200 to-purple-200' },
    { icon: FiCode, x: '12%', y: '75%', delay: 1, gradient: 'from-indigo-200 to-blue-200' },
  ];

  const floatingIconsRight = [
    { icon: FiGlobe, x: '88%', y: '25%', delay: 0.3, gradient: 'from-green-200 to-teal-200' },
    { icon: FiCpu, x: '90%', y: '55%', delay: 0.8, gradient: 'from-orange-200 to-pink-200' },
    { icon: FiZap, x: '87%', y: '80%', delay: 1.2, gradient: 'from-yellow-200 to-orange-200' },
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

  // SEO metadata for Home page
  const seoData = useMemo(() => {
    const faqs = [
      {
        question: 'What is Infinity IT Project Marketplace?',
        answer: 'Infinity is India\'s leading IT project marketplace where students can sell their projects and customers can buy ready-made IT projects with complete source code, documentation, and database. We offer 500+ verified projects in React, Python, AI/ML, Full-Stack, and MERN stack technologies.'
      },
      {
        question: 'What types of projects are available on Infinity?',
        answer: 'We offer 500+ IT projects including React projects, Python projects, AI/ML projects, Full-Stack projects, MERN stack projects, web development projects, mobile app projects, college projects, final year projects, mini projects, and major projects. All projects come with complete source code, documentation, and database.'
      },
      {
        question: 'Can students sell their projects on Infinity?',
        answer: 'Yes! Students can register as sellers and upload their IT projects to earn money. We provide a platform for students to monetize their college projects, final year projects, and other IT projects.'
      },
      {
        question: 'Do projects come with source code and documentation?',
        answer: 'Yes, all projects on Infinity come with complete source code, detailed documentation, database files, installation guides, and setup instructions. We ensure every project is production-ready and well-documented.'
      },
      {
        question: 'What is the refund policy?',
        answer: 'We offer a money-back guarantee. If you\'re not satisfied with your purchase, you can request a refund within the specified period. We also provide lifetime support for all purchased projects.'
      },
      {
        question: 'How quickly can I download purchased projects?',
        answer: 'All projects are available for instant download after purchase. You\'ll receive immediate access to the complete project files including source code, documentation, and database.'
      }
    ];

    const structuredData = combineSchemas(
      generateOrganizationSchema(BASE_URL),
      generateWebSiteSchema(BASE_URL),
      generateFAQSchema(faqs)
    );

    return {
      title: 'Infinity - IT Project Marketplace | Buy & Sell IT Projects Online | React, Python, AI/ML Projects',
      description: 'Infinity - India\'s #1 IT Project Marketplace. Buy ready-made React, Python, AI/ML, Full-Stack, MERN stack projects with complete source code, documentation, and database. Students can sell projects and earn money. 500+ verified projects available.',
      keywords: 'IT projects, buy IT projects, sell IT projects, React projects, Python projects, AI ML projects, full stack projects, college projects, student projects, project marketplace, source code',
      image: `${BASE_URL}/og-image.jpg`,
      url: BASE_URL,
      type: 'website',
      structuredData,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }]
    };
  }, []);

  useSEO(seoData);

  const fetchFeaturedProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await productService.getFeatured();
      setFeaturedProjects(response.data.products?.slice(0, 6) || []);
    } catch (error) {
      // Only log error in development, don't show to users
      if (import.meta.env.DEV) {
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
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // Dynamic theme-based styling
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

  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const parallaxY2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const parallaxOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <main className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-500`}>
      {/* Sticky Navigation Bar */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 backdrop-blur-xl border rounded-2xl shadow-2xl px-6 py-3 hidden md:block transition-colors duration-300 ${
              isDark 
                ? 'bg-gray-800/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
            }`}
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
                        ? 'text-gray-400 hover:text-primary hover:bg-primary/10' 
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
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ml-2 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              >
                <FiFileText size={16} />
                <span>Request Project</span>
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section - Clean Grid Structure */}
      <section id="home" className={`relative min-h-screen flex items-center justify-center ${bgClass} transition-all duration-300`}>
        {/* Animated Background Gradient with Enhanced Parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: parallaxY1 }}
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
              isDark ? 'bg-cyan-500' : 'bg-blue-400'
            }`}
            animate={{
              x: mousePosition.x * 0.01,
              y: mousePosition.y * 0.01,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 50, 
              damping: 20,
              scale: { duration: 8, repeat: Infinity }
            }}
          />
          <motion.div
            style={{ y: parallaxY2 }}
            className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
              isDark ? 'bg-purple-500' : 'bg-purple-400'
            }`}
            animate={{
              x: mousePosition.x * -0.01,
              y: mousePosition.y * -0.01,
              scale: [1, 1.15, 1],
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 50, 
              damping: 20,
              scale: { duration: 10, repeat: Infinity }
            }}
          />
          <motion.div
            style={{ y: parallaxY1 }}
            className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
              isDark ? 'bg-pink-500' : 'bg-pink-400'
            }`}
            animate={{
              x: mousePosition.x * 0.015,
              y: mousePosition.y * 0.015,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 50, 
              damping: 20,
              scale: { duration: 12, repeat: Infinity }
            }}
          />
          {/* Additional futuristic gradient orbs */}
          {!isDark && (
            <>
              <motion.div
                className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
                animate={{
                  x: mousePosition.x * 0.008,
                  y: mousePosition.y * 0.008,
                }}
                transition={{ type: 'spring', stiffness: 40, damping: 25 }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
                animate={{
                  x: mousePosition.x * -0.008,
                  y: mousePosition.y * -0.008,
                }}
                transition={{ type: 'spring', stiffness: 40, damping: 25 }}
              />
            </>
          )}
        </div>

        {/* Floating Pastel Gradient Icons - Left Side (Low Opacity, Symmetrical) - Hidden on mobile */}
        <div className="hidden md:block">
          {floatingIconsLeft.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={`left-${index}`}
                className="absolute pointer-events-none z-0"
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: [0.15, 0.25, 0.15],
                  y: [0, -20, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  delay: item.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md opacity-30`}>
                  <Icon className="w-7 h-7 text-white/60" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Pastel Gradient Icons - Right Side (Low Opacity, Symmetrical) - Hidden on mobile */}
        <div className="hidden md:block">
          {floatingIconsRight.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={`right-${index}`}
                className="absolute pointer-events-none z-0"
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: [0.15, 0.25, 0.15],
                  y: [0, -20, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  delay: item.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md opacity-30`}>
                  <Icon className="w-7 h-7 text-white/60" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Holographic Computer/Laptop Elements - Hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {/* Main 3D Computer Hologram - Left Side (Glitch Type) */}
          <motion.div
            className="absolute left-[5%] top-[20%] computer-3d hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.1, 1],
              rotateY: [0, 360],
            }}
            transition={{
              opacity: { duration: 3, repeat: Infinity },
              scale: { duration: 4, repeat: Infinity },
              rotateY: { duration: 20, repeat: Infinity, ease: 'linear' }
            }}
          >
            <div className="relative w-48 h-36 sm:w-56 sm:h-42 md:w-64 md:h-48 lg:w-72 lg:h-54 xl:w-80 xl:h-60 hologram-glitch rounded-lg border-2 border-cyan-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-pink-500/20 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <FiCpu className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 text-cyan-400/80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse z-10"></div>
            </div>
          </motion.div>

          {/* Secondary 3D Laptop Hologram - Right Side (Shimmer Type) */}
          <motion.div
            className="absolute right-[8%] top-[30%] computer-3d hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.15, 1],
              rotateY: [360, 0],
            }}
            transition={{
              opacity: { duration: 4, repeat: Infinity, delay: 1 },
              scale: { duration: 5, repeat: Infinity, delay: 1 },
              rotateY: { duration: 25, repeat: Infinity, ease: 'linear' }
            }}
          >
            <div className="relative w-40 h-32 sm:w-48 sm:h-36 md:w-56 md:h-40 lg:w-64 lg:h-48 xl:w-72 xl:h-56 hologram-shimmer rounded-lg border-2 border-purple-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <FiCode className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-purple-400/80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse z-10"></div>
            </div>
          </motion.div>

          {/* Floating 3D Code Blocks - Different Hologram Types */}
          {[
            { type: 'hologram-pulse', icon: FiLayers, color: 'cyan', delay: 0 },
            { type: 'hologram-matrix', icon: FiCode, color: 'green', delay: 0.5 },
            { type: 'hologram-neon', icon: FiZap, color: 'purple', delay: 1 }
          ].map((item, i) => (
            <motion.div
              key={`code-${i}`}
              className="absolute computer-3d hidden md:block"
              style={{
                left: `${15 + i * 25}%`,
                top: `${60 + (i % 2) * 20}%`,
              }}
              animate={{
                rotateY: [0, 360],
                rotateX: [0, 15, -15, 0],
                y: [0, -30, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                rotateY: { duration: 15 + i * 5, repeat: Infinity, ease: 'linear' },
                rotateX: { duration: 6 + i * 2, repeat: Infinity },
                y: { duration: 4 + i, repeat: Infinity },
                opacity: { duration: 3 + i, repeat: Infinity },
                delay: item.delay,
              }}
            >
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 ${item.type} rounded-xl border border-${item.color}-500/40 flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-${item.color}-400/70 z-10`} />
              </div>
            </motion.div>
          ))}

          {/* Additional Small Hologram Elements - Default Scan Type */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`small-holo-${i}`}
              className="absolute hidden lg:block"
              style={{
                left: `${20 + i * 60}%`,
                top: `${15 + i * 70}%`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                scale: { duration: 3 + i, repeat: Infinity },
                opacity: { duration: 2 + i, repeat: Infinity },
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: 'linear' },
                delay: i * 0.3,
              }}
            >
              <div className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 hologram-effect rounded-lg border border-cyan-500/30`}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg"></div>
              </div>
            </motion.div>
          ))}

          {/* Holographic Grid Lines */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: 'perspective(1000px) rotateX(60deg)',
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Hero Content - Centered Container with Perfect Alignment */}
        <main className="relative z-10 w-full pt-20 sm:pt-24 md:pt-28 lg:pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              {/* Headline - Multi-line Gradient Text, Perfectly Centered */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold leading-tight mb-4 sm:mb-6 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                  IT Project Marketplace
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                  For Students &{' '}
                </span>
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent block">
                  Customers
                </span>
              </motion.h1>

              {/* Subheading - Explore Projects... Centered with Balanced Letter Spacing */}
              <motion.div
                className="mt-4 sm:mt-6 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300 px-2`}>
                  Explore Projects
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                </h2>
              </motion.div>

              {/* Paragraph - Max Width and Centered */}
              <motion.p
                className={`text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-6 mb-8 sm:mb-12 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Buy ready-made IT projects or sell your own. React, Python, AI/ML, Full-Stack, and more.
              </motion.p>

              {/* Contact Buttons Row - Perfectly Centered with Equal Sizing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap mt-6 sm:mt-8 mb-8 sm:mb-12 px-4"
              >
                <a
                  href={`mailto:${email}`}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-semibold h-12 sm:h-14 w-full sm:w-auto sm:min-w-[160px] sm:flex-1 sm:max-w-[200px]"
                >
                  <FiMail className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
                  <span>Email</span>
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-semibold h-12 sm:h-14 w-full sm:w-auto sm:min-w-[160px] sm:flex-1 sm:max-w-[200px]"
                >
                  <FiMessageSquare className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://www.instagram.com/infiniitywebtechnology/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-semibold h-12 sm:h-14 w-full sm:w-auto sm:min-w-[160px] sm:flex-1 sm:max-w-[200px]"
                >
                  <FiInstagram className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
                  <span>Instagram</span>
                </a>
              </motion.div>

              {/* Main CTA Buttons - Equal-Sized and Center-Aligned */}
              <motion.div
                className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 mb-8 sm:mb-10 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products')}
                  className="px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group h-14 sm:h-16 w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]"
                >
                  <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="whitespace-nowrap">Browse 500+ Projects</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProjectForm(true)}
                  className="px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group h-14 sm:h-16 w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]"
                >
                  <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="whitespace-nowrap">Request Custom Project</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </motion.button>
              </motion.div>

              {/* Feature Icons Row - Single Row, Centered with Equal Spacing */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-6 sm:mt-8 mb-8 sm:mb-12 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiDownload className={`${isDark ? 'text-green-400' : 'text-green-500'} w-4 h-4 sm:w-[18px] sm:h-[18px]`} />
                  <span className={`text-xs sm:text-sm md:text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300`}>Instant Download</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiCode className={`${isDark ? 'text-blue-400' : 'text-blue-500'} w-4 h-4 sm:w-[18px] sm:h-[18px]`} />
                  <span className={`text-xs sm:text-sm md:text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300`}>100% Source Code</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiMessageCircle className={`${isDark ? 'text-purple-400' : 'text-purple-500'} w-4 h-4 sm:w-[18px] sm:h-[18px]`} />
                  <span className={`text-xs sm:text-sm md:text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300`}>Lifetime Support</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiShield className={`${isDark ? 'text-orange-400' : 'text-orange-500'} w-4 h-4 sm:w-[18px] sm:h-[18px]`} />
                  <span className={`text-xs sm:text-sm md:text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300`}>Money Back Guarantee</span>
                </div>
              </motion.div>

              {/* Create Free Account Button */}
              {!isAuthenticated && (
                <motion.div
                  className="mt-6 mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                      isDark 
                        ? 'bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20' 
                        : 'bg-white/90 backdrop-blur-sm border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    Create Free Account →
                  </motion.button>
                  <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-all duration-300`}>
                    Join 10,000+ students and customers
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </section>

      {/* Featured Projects Showcase with Glassy Design */}
      <section id="projects" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/30'
      }`}>
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
              isDark ? 'bg-cyan-500' : 'bg-blue-400'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
              isDark ? 'bg-purple-500' : 'bg-purple-400'
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
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
            </motion.div>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 px-4 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Explore our handpicked collection of top IT projects with live demos
            </p>
            {/* Urgency Banner - Glassy Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-xl ${
                isDark 
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
                          className="px-6 py-3 bg-white/95 backdrop-blur-xl border border-white/30 text-gray-900 font-bold rounded-2xl flex items-center gap-2 shadow-2xl"
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
              <p className="text-gray-600 text-lg">
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
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto group backdrop-blur-sm border border-white/20"
              style={{
                boxShadow: '0 4px 15px 0 rgba(59, 130, 246, 0.5)'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="relative z-10">View All Projects</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Repositories Section */}
      <section id="repositories" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-gray-900 px-2">
              <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                GitHub Repositories
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Browse our curated collection of open-source repositories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                name: 'React Projects',
                description: 'Modern React applications with hooks, context, and state management',
                stars: '2.5k+',
                language: 'JavaScript',
                color: 'from-blue-500 to-cyan-500',
                icon: FiCode,
                link: '/products?filter=react'
              },
              {
                name: 'Python AI/ML',
                description: 'Machine Learning and AI projects using TensorFlow, PyTorch, and more',
                stars: '1.8k+',
                language: 'Python',
                color: 'from-yellow-500 to-orange-500',
                icon: FiCpu,
                link: '/products?filter=ai-ml'
              },
              {
                name: 'Full-Stack Apps',
                description: 'Complete MERN stack applications with authentication and databases',
                stars: '3.2k+',
                language: 'TypeScript',
                color: 'from-purple-500 to-pink-500',
                icon: FiLayers,
                link: '/products?filter=full-stack'
              },
              {
                name: 'Node.js Backend',
                description: 'RESTful APIs, GraphQL servers, and microservices architecture',
                stars: '1.5k+',
                language: 'JavaScript',
                color: 'from-green-500 to-emerald-500',
                icon: FiZap,
                link: '/products?filter=backend'
              },
              {
                name: 'Mobile Apps',
                description: 'React Native and Flutter mobile applications',
                stars: '900+',
                language: 'Dart',
                color: 'from-indigo-500 to-blue-500',
                icon: FiGlobe,
                link: '/products?filter=mobile'
              },
              {
                name: 'DevOps Tools',
                description: 'Docker, Kubernetes, CI/CD pipelines and automation scripts',
                stars: '600+',
                language: 'YAML',
                color: 'from-red-500 to-pink-500',
                icon: FiPackage,
                link: '/products'
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
                  className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${repo.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{repo.name}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 sm:mb-4 text-xs sm:text-sm`}>
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        ⭐ {repo.stars}
                      </span>
                      <span className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {repo.language}
                      </span>
                    </div>
                    <motion.a
                      href={repo.link}
                      onClick={(e) => {
                        if (repo.link.startsWith('/')) {
                          e.preventDefault();
                          navigate(repo.link);
                        }
                      }}
                      whileHover={{ x: 5 }}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      <FiExternalLink className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
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
      <section id="shops" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-gray-900 px-2">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Featured Shops
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Discover amazing shops with live previews and demo links
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: 'E-Commerce Store',
                description: 'Full-featured online shopping platform with cart, checkout, and payment integration',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
                demoUrl: '/products?filter=web-based',
                tech: ['React', 'Node.js', 'MongoDB'],
                rating: 4.9
              },
              {
                name: 'Food Delivery App',
                description: 'Modern food ordering system with real-time tracking and multiple payment options',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
                demoUrl: '/products?filter=mobile',
                tech: ['React Native', 'Firebase', 'Stripe'],
                rating: 4.8
              },
              {
                name: 'Social Media Platform',
                description: 'Connect with friends, share posts, and interact with a modern social network',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
                demoUrl: '/products?filter=full-stack',
                tech: ['Next.js', 'GraphQL', 'PostgreSQL'],
                rating: 4.7
              },
              {
                name: 'Task Management',
                description: 'Organize your projects with kanban boards, timelines, and team collaboration',
                image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
                demoUrl: '/products?filter=web-based',
                tech: ['Vue.js', 'Express', 'MySQL'],
                rating: 4.9
              },
              {
                name: 'Learning Platform',
                description: 'Online courses with video streaming, quizzes, and certificate generation',
                image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
                demoUrl: '/products?filter=full-stack',
                tech: ['Angular', 'Django', 'AWS'],
                rating: 4.8
              },
              {
                name: 'Healthcare Portal',
                description: 'Patient management system with appointments, prescriptions, and telemedicine',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
                demoUrl: '/products?filter=web-based',
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
                className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group`}
              >
                <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={generateGeneralImageAlt(`${shop.name} - ${shop.description}`, 'featured shop')}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    width={800}
                    height={450}
                    decoding="async"
                    aria-label={`View ${shop.name} demo`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-white">
                      <FiStar className="text-yellow-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      <span className="font-bold text-sm sm:text-base">{shop.rating}</span>
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
                        onClick={(e) => {
                          if (shop.demoUrl.startsWith('/')) {
                            e.preventDefault();
                            navigate(shop.demoUrl);
                          }
                        }}
                        target={shop.demoUrl.startsWith('/') ? undefined : '_blank'}
                        rel={shop.demoUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-2xl text-sm sm:text-base"
                      >
                        <FiExternalLink className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">View Projects</span>
                        <span className="sm:hidden">View</span>
                      </motion.a>
                    </motion.div>
                  )}
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{shop.name}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 sm:mb-4 text-xs sm:text-sm`}>
                    {shop.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {shop.tech.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
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
      <section id="tech" className={`py-10 sm:py-12 md:py-16 border-y transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className={`text-center text-xs sm:text-sm mb-6 sm:mb-8 font-medium px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Projects available in these technologies
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 px-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl shadow-md hover:shadow-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all cursor-pointer border ${
                  isDark 
                    ? 'bg-gray-800 text-gray-300 hover:text-primary border-gray-700' 
                    : 'bg-white text-gray-600 hover:text-primary border-gray-200'
                }`}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-12 sm:py-16 md:py-20 transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 to-blue-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-gray-900 px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Everything you need for your IT project requirements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
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
                  className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${service.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm sm:text-base`}>
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Get started in 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-20 transform -translate-y-1/2" />
            
            {[
              {
                step: '01',
                title: 'Browse & Choose',
                description: 'Explore our collection of 500+ ready-made IT projects. Filter by technology, price, or category.',
                icon: FiShoppingBag,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Purchase & Download',
                description: 'Add to cart, checkout securely, and get instant access to complete source code and documentation.',
                icon: FiDownload,
                color: 'from-green-500 to-teal-500'
              },
              {
                step: '03',
                title: 'Start Building',
                description: 'Download your project, follow the setup guide, and customize it for your needs. Get lifetime support!',
                icon: FiZap,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative z-10"
                >
                  <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all text-center`}>
                    <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg`}>
                      <Icon className="text-white w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                    </div>
                    <div className={`text-3xl sm:text-4xl font-extrabold mb-2 sm:mb-3 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
                      {item.step}
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm sm:text-base`}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                What Our Customers Say
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Join thousands of satisfied students and customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Computer Science Student',
                image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2563eb&color=fff',
                rating: 5,
                text: 'Amazing platform! I bought a React e-commerce project and it was exactly what I needed. The code quality is excellent and the documentation is clear. Highly recommended!'
              },
              {
                name: 'Priya Sharma',
                role: 'Final Year Student',
                image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff',
                rating: 5,
                text: 'I sold 3 of my projects here and earned ₹15,000! The platform is easy to use and payments are quick. Great way to monetize my college projects.'
              },
              {
                name: 'Amit Patel',
                role: 'Software Developer',
                image: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10b981&color=fff',
                rating: 5,
                text: 'Perfect for quick project delivery. Bought a Python ML project and customized it for my client. Saved me weeks of development time!'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-yellow-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  ))}
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={testimonial.image}
                    alt={generateGeneralImageAlt(`${testimonial.name} - ${testimonial.role}`, 'testimonial')}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                    loading="lazy"
                    width={48}
                    height={48}
                    decoding="async"
                    aria-label={`${testimonial.name}, ${testimonial.role}`}
                  />
                  <div className="min-w-0">
                    <div className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className={`py-12 sm:py-16 md:py-20 transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4">
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
                  className={`text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                      : 'bg-gradient-to-br from-white to-blue-50 border-gray-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${metric.color} mx-auto mb-2 sm:mb-3 md:mb-4`} />
                  <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </div>
                  <div className={`text-[10px] sm:text-xs md:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-tight`}>
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Everything you need to know
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'What technologies are available?',
                a: 'We offer projects in React, Node.js, Python, AI/ML, Full-Stack, MongoDB, Express, and many more modern technologies.'
              },
              {
                q: 'Do I get the complete source code?',
                a: 'Yes! Every project includes 100% complete source code, documentation, setup instructions, and database files.'
              },
              {
                q: 'Can I customize the projects?',
                a: 'Absolutely! All projects come with full source code that you can modify, customize, and use for your own purposes.'
              },
              {
                q: 'How do I sell my projects?',
                a: 'Simply create a student account, upload your project with images/videos, set your price, and start earning!'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major payment methods including UPI, Credit/Debit cards, and bank transfers in Indian Rupees.'
              },
              {
                q: 'Is there customer support?',
                a: 'Yes! We provide lifetime support for all purchases. Contact us via email, WhatsApp, or Instagram anytime.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all`}
              >
                <h3 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {faq.q}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed text-sm sm:text-base`}>
                  {faq.a}
                </p>
              </motion.div>
            ))}
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
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 sm:mb-5 md:mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of students and customers buying and selling IT projects
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 group text-sm sm:text-base w-full sm:w-auto"
            >
              Browse Projects
              <FiArrowRight className="group-hover:translate-x-1 transition-transform w-[18px] h-[18px] sm:w-5 sm:h-5" />
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

      {/* Right Side Bottom Floating Buttons - Always Visible, Vertical with Equal Spacing - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed right-3 sm:right-5 bottom-3 sm:bottom-5 z-50 flex flex-col items-center gap-2 sm:gap-4"
      >
        {/* Instagram Button */}
        <motion.a
          href="https://www.instagram.com/infiniitywebtechnology/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-pink-500/50 transition-all duration-300 group"
          title="Follow us on Instagram"
        >
          <FiInstagram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </motion.a>
        
        {/* Email Button */}
        <motion.a
          href={`mailto:${email}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-all duration-300 group"
          title={`Email us at ${email}`}
        >
          <FiMail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
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
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 group"
          title="Chat with us on WhatsApp"
        >
          <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </motion.a>
      </motion.div>

      {/* Project Request Form Modal */}
      <ProjectRequestForm isOpen={showProjectForm} onClose={() => setShowProjectForm(false)} />

      {/* AI Chatbot */}
      <AIChatbot />
    </main>
  );
}
