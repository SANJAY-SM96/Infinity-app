import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedPath, setSelectedPath] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-hidden transition-colors duration-300`}>
      {/* Hero Section - Super Home Page with Two Paths */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${bgClass}`}>
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

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Buy ready-made IT projects or sell your own. React, Python, AI/ML, Full-Stack, and more.
          </motion.p>

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

      {/* Tech Stack Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-y border-gray-200 dark:border-gray-700">
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

      {/* Metrics Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
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
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 relative overflow-hidden">
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
    </div>
  );
}
