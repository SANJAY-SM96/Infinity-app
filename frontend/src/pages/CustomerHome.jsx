import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import { 
  FiShoppingBag,
  FiTrendingUp,
  FiStar,
  FiZap,
  FiShield,
  FiArrowRight,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import Loader from '../components/Loader';

export default function CustomerHome() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [featured, trending] = await Promise.all([
        productService.getFeatured(),
        productService.getTrending({ page: 1, limit: 6 })
      ]);
      setFeaturedProjects(featured.data.products?.slice(0, 6) || []);
      setTrendingProjects(trending.data.products || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
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
      icon: FiShoppingBag,
      title: 'Wide Selection',
      description: 'Browse hundreds of ready-made IT projects'
    },
    {
      icon: FiTrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing with exclusive deals'
    },
    {
      icon: FiStar,
      title: 'Quality Projects',
      description: 'All projects are tested and verified'
    },
    {
      icon: FiZap,
      title: 'Instant Download',
      description: 'Get your projects immediately after purchase'
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: 'Safe and secure payment processing'
    }
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} pt-24`}>
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
                Welcome, {user?.name || 'Customer'}! 👋
              </span>
            </h1>
            <p className={`text-xl md:text-2xl ${textMuted} mb-8 max-w-3xl mx-auto`}>
              Discover and purchase ready-made IT projects for your business needs
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                >
                  <FiShoppingBag size={24} />
                  Browse Projects
                </motion.button>
              </Link>
              <Link to="/dashboard/customer">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
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

      {/* Trending Projects Section */}
      {trendingProjects.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-4xl font-extrabold ${textClass} mb-2 flex items-center gap-3`}>
                  <FiTrendingUp className="text-primary" size={36} />
                  Trending Projects
                </h2>
                <p className={textMuted}>
                  Most popular projects right now
                </p>
              </div>
              <Link to="/products?filter=trending">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProjects.map((product, index) => (
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
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-4xl font-extrabold ${textClass} mb-2 flex items-center gap-3`}>
                <FiStar className="text-yellow-500" size={36} />
                Featured Projects
              </h2>
              <p className={textMuted}>
                Hand-picked projects for you
              </p>
            </div>
            <Link to="/products?filter=featured">
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
    </div>
  );
}

