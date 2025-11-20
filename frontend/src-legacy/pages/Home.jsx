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
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO';
import { generateGeneralImageAlt } from '../utils/imageOptimizer';
import { BASE_URL, generateOrganizationSchema, generateWebSiteSchema, generateFAQSchema, combineSchemas } from '../utils/seoConfig';
import { getHomeSectionNavItems } from '../utils/navigation';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import AIChatbot from '../components/AIChatbot';
import { BeamCircle } from '../components/ui/beam-circle';
import { ParticleBackground } from '../components/ui/ParticleBackground';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
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
      },
      {
        question: 'Do you provide hosting services?',
        answer: 'Yes! We offer web hosting, cloud hosting, and database hosting services. Starting from ₹299/month with 99.9% uptime guarantee, free SSL certificates, and 24/7 support.'
      },
      {
        question: 'What support services do you offer?',
        answer: 'We provide free lifetime support for all purchased projects including 24/7 assistance, setup help, and bug fixes. Support is available via email, WhatsApp, and live chat.'
      },
      {
        question: 'Do you offer SEO optimization services?',
        answer: 'Yes! We provide professional SEO services including on-page SEO, technical SEO, and SEO analytics. Our services help improve your website\'s search engine rankings and visibility.'
      },
      {
        question: 'Are IEEE projects available?',
        answer: 'Yes! We offer 450+ IEEE projects including final year projects, mini projects, and major projects. All IEEE projects come with complete source code, documentation, and database files.'
      }
    ];

    const structuredData = combineSchemas(
      generateOrganizationSchema(BASE_URL),
      generateWebSiteSchema(BASE_URL),
      generateFAQSchema(faqs)
    );

    return {
      title: 'Infinity - IT Project Marketplace | Hosting, SEO, Support Services | IEEE Projects | Buy & Sell IT Projects',
      description: 'Infinity - India\'s #1 IT Project Marketplace. Buy ready-made React, Python, AI/ML, Full-Stack, MERN stack projects with complete source code. Get cloud hosting, SEO optimization services, free support, and IEEE projects. Students can sell projects and earn money. 500+ verified projects available.',
      keywords: 'IT projects, buy IT projects, sell IT projects, React projects, Python projects, AI ML projects, full stack projects, college projects, student projects, project marketplace, source code, cloud hosting, web hosting, SEO optimization, SEO services, free support, IEEE projects, IEEE final year projects, IEEE mini projects, database hosting',
      image: `${BASE_URL}/og-image.jpg`,
      url: BASE_URL,
      type: 'website',
      structuredData,
      breadcrumbs: [{ name: 'Home', url: BASE_URL }]
    };
  }, []);

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
      <SEO {...seoData} />
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
                  onClick={() => navigate('/products')}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300 group"
                >
                  <span>Browse Projects</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register?userType=student')}
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
              onClick={() => navigate('/products')}
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

      {/* Buyer Features Section */}
      <section id="buyer-features" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-primary-50/20'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                For Buyers
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Get production-ready IT projects instantly. Complete source code included.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiShoppingBag,
                title: 'Browse 500+ Projects',
                description: 'Filter by technology, price, or category. React, Python, AI/ML, Full-Stack, and more.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: FiDownload,
                title: 'Instant Access',
                description: 'Download immediately after purchase. Get complete source code, docs, and database files.',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: FiFileText,
                title: 'Complete Documentation',
                description: 'Every project includes setup guides, API docs, and installation instructions.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: FiShield,
                title: 'Quality Guaranteed',
                description: 'All projects verified and tested. Clean code. Production-ready. No bugs.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: FiMessageCircle,
                title: 'Free Support',
                description: 'Lifetime support included. Get help via email, WhatsApp, or live chat.',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                icon: FiCheck,
                title: 'Money-Back Guarantee',
                description: 'Not satisfied? Get a full refund. No questions asked. Risk-free purchase.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seller Features Section */}
      <section id="seller-features" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-white to-slate-50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                For Sellers
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Monetize your IT projects. Set your price. Start earning today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiUpload,
                title: 'Easy Upload',
                description: 'Upload projects in minutes. Add images, videos, descriptions. Simple process.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: FiBarChart2,
                title: 'Set Your Price',
                description: 'You decide the price. No fixed rates. Earn what your project is worth.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: FiTrendingUp,
                title: 'Fast Payments',
                description: 'Get paid quickly. Secure transactions. Direct bank transfers in Indian Rupees.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: FiUsers,
                title: 'Large Audience',
                description: 'Reach 10K+ potential buyers. Your project gets maximum visibility.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: FiStar,
                title: 'Build Reputation',
                description: 'Get reviews and ratings. Build your seller profile. Grow your brand.',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                icon: FiZap,
                title: 'No Listing Fees',
                description: 'Zero upfront costs. Only pay when you sell. Keep 100% of your profits.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marketplace Categories Section */}
      <section id="categories" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-primary-50/20'
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Marketplace Categories
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Explore projects across all major technologies and frameworks
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
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${repo.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{repo.name}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3 sm:mb-4 text-xs sm:text-sm`}>
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        ⭐ {repo.stars}
                      </span>
                      <span className={`px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
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
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group"
            >
              View All Categories
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Models Section */}
      <section id="pricing" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-white to-slate-50'
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
                Pricing Models
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Transparent pricing. Fair rates. Value for money.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Ready-Made Projects',
                price: '₹299 - ₹9999',
                description: 'Buy complete IT projects with full source code',
                features: [
                  'Complete source code',
                  'Documentation included',
                  'Database files',
                  'Instant download',
                  'Lifetime support',
                  'Money-back guarantee'
                ],
                color: 'from-blue-500 to-cyan-500',
                popular: false
              },
              {
                title: 'Premium Projects',
                price: '₹10000 - ₹50000',
                description: 'High-end projects with advanced features',
                features: [
                  'Enterprise-grade code',
                  'Complete documentation',
                  'Setup assistance',
                  'Priority support',
                  'Custom modifications',
                  'Source code ownership'
                ],
                color: 'from-purple-500 to-pink-500',
                popular: true
              },
              {
                title: 'Custom Development',
                price: 'Custom Quote',
                description: 'Get projects built to your specifications',
                features: [
                  'Tailored solutions',
                  'Latest technologies',
                  'Full documentation',
                  'Dedicated support',
                  'Iterative development',
                  'Source code delivery'
                ],
                color: 'from-green-500 to-teal-500',
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all relative ${plan.popular ? 'ring-2 ring-primary' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <FiPackage className="text-white w-6 h-6" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {plan.title}
                </h3>
                <div className={`text-3xl font-extrabold mb-1 text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {plan.price}
                </div>
                <p className={`text-sm text-center mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FiCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(plan.title === 'Custom Development' ? '/contact' : '/products')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular
                    ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
                    : isDark
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                  {plan.title === 'Custom Development' ? 'Request Quote' : 'Browse Projects'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Projects Section */}
      <section id="shops" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-white'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Sample Projects
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Explore real projects with live demos and complete source code
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
                className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group`}
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
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{shop.name}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3 sm:mb-4 text-xs sm:text-sm`}>
                    {shop.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {shop.tech.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
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
              View All Projects
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Hosting & Cloud Services Section */}
      <section id="hosting" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-primary-50/20'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Hosting & Cloud Services
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Reliable cloud hosting solutions for your projects. Fast, secure, and scalable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiServer,
                title: 'Web Hosting',
                description: 'Fast and reliable web hosting for your projects. 99.9% uptime guarantee. SSD storage included.',
                features: ['Unlimited Bandwidth', 'Free SSL Certificate', '24/7 Support', 'Easy Setup'],
                color: 'from-blue-500 to-cyan-500',
                price: 'Starting at ₹299/month'
              },
              {
                icon: FiCloud,
                title: 'Cloud Hosting',
                description: 'Scalable cloud infrastructure. Auto-scaling resources. Perfect for growing applications.',
                features: ['Auto Scaling', 'Load Balancing', 'CDN Included', 'Backup & Recovery'],
                color: 'from-purple-500 to-pink-500',
                price: 'Starting at ₹999/month'
              },
              {
                icon: FiDatabase,
                title: 'Database Hosting',
                description: 'Managed database services. MySQL, MongoDB, PostgreSQL. Automated backups included.',
                features: ['Managed Databases', 'Auto Backups', 'High Availability', 'Performance Monitoring'],
                color: 'from-green-500 to-teal-500',
                price: 'Starting at ₹499/month'
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
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{service.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed mb-4`}>
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FiCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className={`text-sm font-bold ${isDark ? 'text-primary-light' : 'text-primary'} mb-3`}>
                    {service.price}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/contact')}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg"
                  >
                    Get Started
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Services Section */}
      <section id="support" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-white to-slate-50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Support Services
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Free support included with every purchase. Expert help when you need it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiHeadphones,
                title: 'Free Support',
                description: 'Lifetime free support for all purchased projects. Email, WhatsApp, and live chat available.',
                color: 'from-green-500 to-emerald-500',
                badge: 'FREE'
              },
              {
                icon: FiMessageCircle,
                title: '24/7 Assistance',
                description: 'Round-the-clock support. Get help anytime, anywhere. Quick response guaranteed.',
                color: 'from-blue-500 to-cyan-500',
                badge: '24/7'
              },
              {
                icon: FiSettings,
                title: 'Setup Help',
                description: 'Need help setting up your project? Our experts will guide you through the entire process.',
                color: 'from-purple-500 to-pink-500',
                badge: 'INCLUDED'
              },
              {
                icon: FiActivity,
                title: 'Bug Fixes',
                description: 'Found an issue? We\'ll fix it for free. All projects come with bug fix guarantee.',
                color: 'from-orange-500 to-red-500',
                badge: 'FREE'
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
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all relative`}
                >
                  {service.badge && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {service.badge}
                      </span>
                    </div>
                  )}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{service.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed`}>
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Optimization Services Section */}
      <section id="seo" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-primary-50/20'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                SEO Optimization Services
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Boost your website's visibility. Professional SEO services to rank higher on search engines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiSearch,
                title: 'On-Page SEO',
                description: 'Optimize your website content, meta tags, and structure for better search engine rankings.',
                features: ['Meta Tags Optimization', 'Content Optimization', 'Image SEO', 'Schema Markup'],
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: FiBarChart2,
                title: 'Technical SEO',
                description: 'Improve site speed, mobile responsiveness, and technical aspects for better rankings.',
                features: ['Site Speed Optimization', 'Mobile Optimization', 'XML Sitemaps', 'Robots.txt'],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: FiTrendingUp,
                title: 'SEO Analytics',
                description: 'Track your SEO performance with detailed analytics and reporting. Monitor rankings and traffic.',
                features: ['Rank Tracking', 'Traffic Analysis', 'Keyword Research', 'Competitor Analysis'],
                color: 'from-green-500 to-teal-500'
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
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{service.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed mb-4`}>
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FiCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/contact')}
                    className="w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg"
                  >
                    Get SEO Services
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IEEE Projects Section */}
      <section id="ieee-projects" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-white to-slate-50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                IEEE Projects Available
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Buy ready-made IEEE consumption projects. Complete source code, documentation, and database included.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: FiAward,
                title: 'IEEE Final Year Projects',
                description: 'Complete IEEE standard projects for final year students. All domains covered. Ready to submit.',
                features: ['IEEE Standards', 'Complete Documentation', 'Source Code', 'Database Files'],
                color: 'from-indigo-500 to-purple-500',
                count: '100+ Projects'
              },
              {
                icon: FiCode,
                title: 'IEEE Mini Projects',
                description: 'IEEE mini projects for academic requirements. Quick delivery. Affordable pricing.',
                features: ['Quick Delivery', 'Affordable Prices', 'Complete Code', 'Setup Guide'],
                color: 'from-purple-500 to-pink-500',
                count: '200+ Projects'
              },
              {
                icon: FiBookOpen,
                title: 'IEEE Major Projects',
                description: 'Comprehensive IEEE major projects with advanced features. Perfect for final year submissions.',
                features: ['Advanced Features', 'Full Documentation', 'Video Tutorials', 'Lifetime Support'],
                color: 'from-pink-500 to-red-500',
                count: '150+ Projects'
              }
            ].map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all relative`}
                >
                  <div className="absolute -top-3 right-4">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {project.count}
                    </span>
                  </div>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{project.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed mb-4`}>
                    {project.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FiCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products?filter=ieee')}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
                  >
                    Browse IEEE Projects
                  </motion.button>
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
              onClick={() => navigate('/products?filter=ieee')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group"
            >
              View All IEEE Projects
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className={`py-10 sm:py-12 md:py-16 border-y transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700'
        : 'bg-gradient-to-r from-slate-50 to-indigo-50 border-slate-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            className={`text-center text-xs sm:text-sm mb-6 sm:mb-8 font-medium px-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
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
                className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl shadow-md hover:shadow-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all cursor-pointer border ${isDark
                  ? 'bg-slate-800 text-slate-300 hover:text-primary border-slate-700'
                  : 'bg-white text-slate-600 hover:text-primary border-slate-200'
                  }`}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="workflow" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-white to-slate-50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Simple workflow. Fast delivery. Great results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-20 transform -translate-y-1/2" />

            {[
              {
                step: '01',
                title: 'Browse Projects',
                description: 'Search our marketplace. Filter by tech stack. View live demos. Compare features.',
                icon: FiShoppingBag,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Purchase & Download',
                description: 'Add to cart. Secure checkout. Instant download. Get complete source code and docs.',
                icon: FiDownload,
                color: 'from-green-500 to-teal-500'
              },
              {
                step: '03',
                title: 'Customize & Deploy',
                description: 'Follow setup guide. Customize code. Deploy your project. Get free lifetime support.',
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
                  <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all text-center`}>
                    <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg`}>
                      <Icon className="text-white w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                    </div>
                    <div className={`text-3xl sm:text-4xl font-extrabold mb-2 sm:mb-3 ${isDark ? 'text-slate-400' : 'text-slate-300'}`}>
                      {item.step}
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed text-sm sm:text-base`}>
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
      <section className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-slate-50 to-white'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                What Our Customers Say
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Real reviews from real customers. Trusted by thousands.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Computer Science Student',
                image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2563eb&color=fff',
                rating: 5,
                text: 'Bought a React e-commerce project. Complete source code. Clear documentation. Saved me months of work. Worth every rupee!'
              },
              {
                name: 'Priya Sharma',
                role: 'Final Year Student',
                image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff',
                rating: 5,
                text: 'Sold 3 projects. Earned ₹15,000 in 2 months. Easy upload process. Fast payments. Best way to monetize college projects!'
              },
              {
                name: 'Amit Patel',
                role: 'Freelance Developer',
                image: 'https://ui-avatars.com/api/?name=Amit+Patel&background=10b981&color=fff',
                rating: 5,
                text: 'Bought Python ML project for client. Instant download. Clean code. Customized in days. Client loved it. Highly recommended!'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-yellow-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  ))}
                </div>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base`}>
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
                    <div className={`font-semibold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-slate-900'} truncate`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} truncate`}>
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
      <section id="metrics" className={`py-12 sm:py-16 md:py-20 transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-white'
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
                  className={`text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer ${isDark
                    ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600'
                    : 'bg-gradient-to-br from-white to-indigo-50 border-slate-200'
                    }`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${metric.color} mx-auto mb-2 sm:mb-3 md:mb-4`} />
                  <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-1 sm:mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {metric.value}
                  </div>
                  <div className={`text-[10px] sm:text-xs md:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-tight`}>
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-slate-50 to-white'
        }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Common questions. Quick answers. Clear information.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'What projects are available on Infinity?',
                a: 'We offer 500+ IT projects in React, Python, AI/ML, Full-Stack, Node.js, MongoDB, Express, and more. All with complete source code.'
              },
              {
                q: 'Do projects include full source code?',
                a: 'Yes. Every project includes 100% complete source code, documentation, database files, and setup guides. No hidden files.'
              },
              {
                q: 'Can I customize purchased projects?',
                a: 'Absolutely. All projects come with full source code. Modify, customize, and use for your needs. Complete ownership included.'
              },
              {
                q: 'How do I sell my IT projects?',
                a: 'Create a seller account. Upload project with images. Set your price. Start earning. Payments processed within 3-5 business days.'
              },
              {
                q: 'What payment methods are accepted?',
                a: 'UPI, Credit/Debit cards, Net Banking, and bank transfers. All payments in Indian Rupees. Secure and encrypted transactions.'
              },
              {
                q: 'What support do you provide?',
                a: 'Lifetime support for all purchases. Email, WhatsApp, and live chat. Setup assistance. Bug fixes. Quick responses guaranteed.'
              },
              {
                q: 'What is your refund policy?',
                a: 'Money-back guarantee within 7 days if not satisfied. No questions asked. 100% refund. We stand behind every project.'
              },
              {
                q: 'How quickly can I download projects?',
                a: 'Instant download after purchase. No waiting. Access complete files immediately. Download links valid forever.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all`}
              >
                <h3 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {faq.q}
                </h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed text-sm sm:text-base`}>
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-primary via-primary-light to-accent relative overflow-hidden">
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
            Start buying or selling IT projects today. Join 10K+ happy customers.
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
