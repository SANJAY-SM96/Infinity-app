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
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
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
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome, {user?.name || 'Student'}! 👋
              </span>
            </h1>
            <p className={`text-xl md:text-2xl ${textMuted} mb-8 max-w-3xl mx-auto`}>
              Get custom-made IT projects for your college assignments and final year projects
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
              >
                <FiFileText size={24} />
                Request Custom Project
              </motion.button>
              <Link to="/dashboard/student">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-all flex items-center gap-3"
                >
                  View Dashboard
                  <FiArrowRight size={20} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`${cardBg} border rounded-2xl p-6 text-center`}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className={`${textClass} font-bold text-lg mb-2`}>{feature.title}</h3>
                  <p className={`${textMuted} text-sm`}>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-4xl font-extrabold ${textClass} mb-2`}>
                Featured Projects
              </h2>
              <p className={textMuted}>
                Browse ready-made projects you can purchase
              </p>
            </div>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center gap-2"
              >
                View All
                <FiArrowRight size={18} />
              </motion.button>
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${cardBg} border rounded-3xl p-12 text-center bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-blue-50/50 to-indigo-50/50'}`}
          >
            <FiCheckCircle className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className={`text-4xl font-extrabold ${textClass} mb-4`}>
              Need a Custom Project?
            </h2>
            <p className={`text-lg ${textMuted} mb-8 max-w-2xl mx-auto`}>
              Submit your requirements and our team will create a custom IT project tailored to your needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProjectForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
            >
              <FiFileText size={24} />
              Request Now
            </motion.button>
          </motion.div>
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

