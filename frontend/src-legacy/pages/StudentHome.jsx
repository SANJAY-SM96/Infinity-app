import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import ProjectRequestForm from '../components/ProjectRequestForm';
import {
  FiFileText,
  FiShoppingBag,
  FiTrendingUp,
  FiStar,
  FiCode,
  FiZap,
  FiUsers,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import Loader from '../components/Loader';
import StudentSEO from '../components/student/StudentSEO';
import ProjectTopics from '../components/student/ProjectTopics';
import ProjectPlanner from '../components/student/ProjectPlanner';
import ProjectGallery from '../components/student/ProjectGallery';

export default function StudentHome() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const response = await productService.getFeatured();
      setFeaturedProjects(response.data.products?.slice(0, 6) || []);
    } catch (error) {
      console.error('Failed to fetch featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700'
    : 'bg-white/80 backdrop-blur-xl border-gray-200';

  const features = [
    {
      icon: FiFileText,
      title: 'Custom Projects',
      description: 'Request tailor-made IT projects for your college assignments'
    },
    {
      icon: FiCode,
      title: 'Latest Tech Stack',
      description: 'Get projects built with modern technologies and frameworks'
    },
    {
      icon: FiStar,
      title: 'Quality Guaranteed',
      description: 'All projects are tested and verified for quality'
    },
    {
      icon: FiZap,
      title: 'Fast Delivery',
      description: 'Quick turnaround time for your project requirements'
    }
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} pt-24`}>
      <StudentSEO />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome, {user?.name || 'Student'}! 👋
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${textMuted} mb-6 sm:mb-8 max-w-3xl mx-auto px-4`}>
              Get custom-made IT projects for your college assignments and final year projects
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectForm(true)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Request Custom Project</span>
              </motion.button>
              <Link to="/dashboard/student" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <span>View Dashboard</span>
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-10 sm:mt-12 md:mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className={`${textClass} font-bold text-base sm:text-lg mb-1 sm:mb-2`}>{feature.title}</h3>
                  <p className={`${textMuted} text-xs sm:text-sm`}>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="min-w-0 flex-1">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${textClass} mb-1 sm:mb-2`}>
                Featured Projects
              </h2>
              <p className={`text-sm sm:text-base ${textMuted}`}>
                Browse ready-made projects you can purchase
              </p>
            </div>
            <Link to="/products" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>View All</span>
                <FiArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </motion.button>
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {featuredProjects.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${cardBg} border rounded-2xl`}>
              <p className={textMuted}>No featured projects available</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${cardBg} border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-blue-50/50 to-indigo-50/50'}`}
          >
            <FiCheckCircle className="text-green-500 mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${textClass} mb-3 sm:mb-4`}>
              Need a Custom Project?
            </h2>
            <p className={`text-sm sm:text-base md:text-lg ${textMuted} mb-6 sm:mb-8 max-w-2xl mx-auto px-4`}>
              Submit your requirements and our team will create a custom IT project tailored to your needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProjectForm(true)}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 mx-auto text-sm sm:text-base"
            >
              <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Request Now</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Student Project Zone */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider mb-4">
              New Feature
            </span>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${textClass} mb-4`}>
              Student Project Zone
            </h2>
            <p className={`text-lg ${textMuted} max-w-2xl mx-auto`}>
              Your all-in-one workspace to explore, plan, and showcase your academic projects.
            </p>
          </div>

          <ProjectTopics />
          <ProjectPlanner />
          <ProjectGallery />
        </div>
      </section>

      {/* Project Request Form Modal */}
      <ProjectRequestForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
      />
    </div>
  );
}

