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
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome, {user?.name || 'Customer'}! 👋
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${textMuted} mb-6 sm:mb-8 max-w-3xl mx-auto px-4`}>
              Discover and purchase ready-made IT projects for your business needs
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
              <Link to="/products" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Browse Projects</span>
                </motion.button>
              </Link>
              <Link to="/dashboard/customer" className="w-full sm:w-auto">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-10 sm:mt-12 md:mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`${cardBg} border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 text-center`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <Icon className="text-white w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className={`${textClass} font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2`}>{feature.title}</h3>
                  <p className={`${textMuted} text-xs sm:text-sm leading-tight`}>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Projects Section */}
      {trendingProjects.length > 0 && (
        <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="min-w-0 flex-1">
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${textClass} mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3`}>
                  <FiTrendingUp className="text-primary w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                  <span>Trending Projects</span>
                </h2>
                <p className={`text-sm sm:text-base ${textMuted}`}>
                  Most popular projects right now
                </p>
              </div>
              <Link to="/products?filter=trending" className="w-full sm:w-auto">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="min-w-0 flex-1">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${textClass} mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3`}>
                <FiStar className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" />
                <span>Featured Projects</span>
              </h2>
              <p className={`text-sm sm:text-base ${textMuted}`}>
                Hand-picked projects for you
              </p>
            </div>
            <Link to="/products?filter=featured" className="w-full sm:w-auto">
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
    </div>
  );
}

