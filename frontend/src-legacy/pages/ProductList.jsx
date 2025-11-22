import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { BASE_URL, generateItemListSchema, generateOrganizationSchema, combineSchemas } from '../utils/seoConfig';
import { useAuth } from '../context/AuthContext';
import { 
  FiSearch, 
  FiX, 
  FiFilter, 
  FiTrendingUp, 
  FiStar, 
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiGrid,
  FiList,
  FiCheck,
  FiDownload,
  FiShield,
  FiZap,
  FiUsers,
  FiArrowRight,
  FiSliders,
  FiTag
} from 'react-icons/fi';
import { PRODUCT_FILTERS, SORT_OPTIONS } from '../utils/constants';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import toast from 'react-hot-toast';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) setActiveFilter(filterParam);
  }, [searchParams]);

  // Define fetchProducts before using it in useEffect
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      if (activeFilter === 'trending') {
        response = await productService.getTrending({ page, limit: 12, search });
      } else if (activeFilter === 'top-selling') {
        response = await productService.getTopSelling({ page, limit: 12, search });
      } else if (activeFilter === 'new-uploads') {
        response = await productService.getNewUploads({ page, limit: 12, search });
      } else if (activeFilter === 'web-based') {
        response = await productService.getWebBased({ page, limit: 12, search });
      } else {
        response = await productService.getAll({ page, limit: 12, search, filterType: activeFilter });
      }
      
      let fetchedProducts = response.data.products || [];
      
      // Apply client-side sorting
      if (sortBy) {
        fetchedProducts = [...fetchedProducts].sort((a, b) => {
          switch (sortBy) {
            case 'price':
              return (a.priceINR || a.price || 0) - (b.priceINR || b.price || 0);
            case '-price':
              return (b.priceINR || b.price || 0) - (a.priceINR || a.price || 0);
            case '-rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'title':
              return (a.title || '').localeCompare(b.title || '');
            case '-createdAt':
            default:
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          }
        });
      }
      
      // Apply price filter
      fetchedProducts = fetchedProducts.filter(p => {
        const price = p.priceINR || p.price || 0;
        return price >= priceRange.min && price <= priceRange.max;
      });
      
      setProducts(fetchedProducts);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn('Rate limit exceeded. Please wait a moment.');
      } else {
        console.error('Failed to fetch products:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilter, sortBy, priceRange]);

  useEffect(() => { 
    const timer = setTimeout(() => {
      fetchProducts();
    }, search ? 500 : 0);
    
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // SEO metadata
  const filterLabel = useMemo(() => {
    const filter = PRODUCT_FILTERS.find(f => f.id === activeFilter);
    return filter ? filter.label : 'All IT Projects';
  }, [activeFilter]);

  const seoData = useMemo(() => {
    const currentUrl = `${BASE_URL}/products${activeFilter ? `?filter=${activeFilter}` : ''}`;
    const pageTitle = activeFilter 
      ? `${filterLabel} | Buy ${filterLabel} Online | Infinity Web Technology`
      : 'IT Projects Marketplace | Buy React, Python, AI/ML Projects Online | Infinity Web Technology';
    const pageDescription = activeFilter
      ? `Browse ${filterLabel} with complete source code at Infinity Web Technology. Buy ${filterLabel.toLowerCase()} for college projects, final year projects, and professional use. Instant download, lifetime support.`
      : 'Browse 500+ ready-made IT projects including React, Python, AI/ML, Full-Stack, MERN stack projects with complete source code at Infinity Web Technology. Buy IT projects for college, final year, and professional use.';
    
    const breadcrumbs = [
      { name: 'Home', url: BASE_URL },
      { name: 'Products', url: `${BASE_URL}/products` }
    ];
    if (activeFilter) {
      breadcrumbs.push({ name: filterLabel, url: currentUrl });
    }

    // Generate structured data using SEO config
    const itemListSchema = generateItemListSchema(products, `${filterLabel} - IT Projects`, currentUrl, BASE_URL);
    const organizationSchema = generateOrganizationSchema(BASE_URL);
    const structuredData = combineSchemas(itemListSchema, organizationSchema);

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: `${filterLabel}, IT projects, buy ${filterLabel.toLowerCase()}, source code, college projects, final year projects, React projects, Python projects, AI ML projects, Infinity Web Technology`,
      image: `${BASE_URL}/og-image.jpg`,
      url: currentUrl,
      type: 'website',
      structuredData,
      breadcrumbs
    };
  }, [activeFilter, filterLabel, products]);

  useSEO(seoData);

  const layoutClasses = getPageLayoutClasses(isDark);
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';
  const glassBg = isDark 
    ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
    : 'bg-white/70 backdrop-blur-xl border border-white/20';

  return (
    <main className={cn('min-h-screen relative overflow-hidden', bgClass, textClass)}>
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
      {/* Hero Section with Trust Signals - Glassy Design */}
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden z-10">
        <div className={commonClasses.container + ' relative z-10'}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 font-bold text-sm sm:text-base mb-4">
                <FiZap className="w-4 h-4" />
                <span>500+ Projects Available</span>
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {activeFilter ? filterLabel : 'IT Projects Marketplace'}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              {activeFilter 
                ? `Discover premium ${filterLabel.toLowerCase()} with complete source code, documentation, and lifetime support.`
                : 'Buy ready-made IT projects or sell your own. React, Python, AI/ML, Full-Stack, and more.'
              }
            </p>

            {/* Trust Badges - Glassy Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-lg ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/70 border-white/30'
                }`}
              >
                <FiDownload className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold">Instant Download</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-lg ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/70 border-white/30'
                }`}
              >
                <FiShield className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold">Money Back Guarantee</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-lg ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/70 border-white/30'
                }`}
              >
                <FiUsers className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-semibold">10K+ Happy Customers</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-lg ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/70 border-white/30'
                }`}
              >
                <FiStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">4.9/5 Rating</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className={commonClasses.container}>
        {/* Search and Filter Bar - Glassy Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8 relative z-10"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar - Glassy */}
            <div className="flex-1 relative">
              <FiSearch className={cn('absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10', isDark ? 'text-gray-300' : 'text-gray-500')} />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search projects by name, technology, or category..."
                className={cn(
                  'w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all backdrop-blur-xl',
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30' 
                    : 'bg-white/70 border-white/30 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20',
                  'text-base shadow-xl focus:shadow-2xl'
                )}
                aria-label="Search IT projects"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className={cn('absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition', isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100')}
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex gap-3">
              {/* Sort Dropdown - Glassy */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className={cn(
                    'appearance-none pl-4 pr-10 py-4 rounded-2xl border-2 transition-all cursor-pointer backdrop-blur-xl',
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white focus:border-primary focus:ring-2 focus:ring-primary/30' 
                      : 'bg-white/70 border-white/30 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'text-sm font-semibold shadow-xl focus:shadow-2xl'
                  )}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <FiChevronDown className={cn('absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none', isDark ? 'text-gray-400' : 'text-gray-500')} />
              </div>

              {/* View Mode Toggle - Glassy */}
              <div className={cn('flex rounded-2xl border-2 overflow-hidden shadow-xl backdrop-blur-xl', isDark ? 'border-white/20 bg-white/10' : 'border-white/30 bg-white/70')}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-4 transition-all',
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                      : isDark ? 'bg-transparent text-gray-300 hover:text-white' : 'bg-transparent text-gray-600 hover:text-primary'
                  )}
                  aria-label="Grid view"
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-4 transition-all border-l-2',
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                      : isDark ? 'bg-transparent text-gray-300 hover:text-white border-white/20' : 'bg-transparent text-gray-600 hover:text-primary border-white/30'
                  )}
                  aria-label="List view"
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle Button - Glassy */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'px-6 py-4 rounded-2xl border-2 transition-all flex items-center gap-2 font-semibold shadow-xl backdrop-blur-xl',
                  showFilters
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white border-transparent'
                    : isDark 
                      ? 'bg-white/10 border-white/20 text-white hover:border-primary' 
                      : 'bg-white/70 border-white/30 text-gray-900 hover:border-primary'
                )}
              >
                <FiSliders className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel - Glassy */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'mt-4 p-6 rounded-2xl border-2 shadow-2xl overflow-hidden backdrop-blur-xl',
                  isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-white/30'
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className={cn('block text-sm font-bold mb-3', textClass)}>Price Range</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min || ''}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                        className={cn(
                          'flex-1 px-4 py-3 rounded-xl border-2',
                          isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary'
                        )}
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max || ''}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 100000 })}
                        className={cn(
                          'flex-1 px-4 py-3 rounded-xl border-2',
                          isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary'
                        )}
                      />
                    </div>
                  </div>

                  {/* Quick Price Filters */}
                  <div>
                    <label className={cn('block text-sm font-bold mb-3', textClass)}>Quick Filters</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Under ₹500', min: 0, max: 500 },
                        { label: '₹500 - ₹1000', min: 500, max: 1000 },
                        { label: '₹1000 - ₹2500', min: 1000, max: 2500 },
                        { label: 'Above ₹2500', min: 2500, max: 100000 }
                      ].map((filter) => (
                        <button
                          key={filter.label}
                          onClick={() => setPriceRange({ min: filter.min, max: filter.max })}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                            priceRange.min === filter.min && priceRange.max === filter.max
                              ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                              : isDark 
                                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          )}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category Filter Pills - Glassy Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 sm:mb-8 relative z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiTag className={cn('w-5 h-5', isDark ? 'text-gray-300' : 'text-gray-600')} />
            <span className={cn('text-sm font-bold', isDark ? 'text-gray-200' : 'text-gray-700')}>
              Browse by Category
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveFilter(''); setPage(1); }}
              className={cn(
                'px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 backdrop-blur-xl border-2 shadow-xl',
                activeFilter === ''
                  ? 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white border-transparent hover:shadow-2xl'
                  : isDark 
                    ? 'bg-white/10 text-gray-200 border-white/20 hover:border-primary hover:bg-white/15' 
                    : 'bg-white/70 text-gray-700 border-white/30 hover:border-primary hover:bg-white/80'
              )}
            >
              <FiShoppingBag className="w-4 h-4" />
              All Projects
            </motion.button>
            {PRODUCT_FILTERS.map((filter) => {
              const icons = {
                'trending': FiTrendingUp,
                'top-selling': FiStar,
                'new-uploads': FiZap,
                'web-based': FiGrid
              };
              const Icon = icons[filter.id] || FiTag;
              
              return (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveFilter(filter.id); setPage(1); }}
                  className={cn(
                    'px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 backdrop-blur-xl border-2 shadow-xl',
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white border-transparent hover:shadow-2xl'
                      : isDark 
                        ? 'bg-white/10 text-gray-200 border-white/20 hover:border-primary hover:bg-white/15' 
                        : 'bg-white/70 text-gray-700 border-white/30 hover:border-primary hover:bg-white/80'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Count and Quick Actions */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <p className={cn('text-sm font-semibold', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Showing <span className="text-primary font-bold">{products.length}</span> projects
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-sm text-primary hover:underline font-semibold"
                >
                  Clear search
                </button>
              )}
            </div>
            
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <FiUsers className="w-4 h-4" />
                Create Free Account
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Products Grid/List - Glassy Container */}
        <motion.section 
          className="w-full relative z-10" 
          aria-label="Products listing"
          variants={animationVariants.staggerContainer}
          initial="initial"
          animate="animate"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={cn(
                'mb-8',
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'flex flex-col gap-4'
              )}>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={animationVariants.staggerItem}
                    transition={{ delay: index * 0.03 }}
                    className={viewMode === 'list' ? 'w-full' : ''}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
                  variants={animationVariants.fadeIn}
                  initial="initial"
                  animate="animate"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={cn(
                      'px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2',
                      page === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-xl',
                      isDark && page === 1 ? 'bg-gray-800 text-gray-500' : ''
                    )}
                  >
                    <FiChevronUp className="w-5 h-5 rotate-[-90deg]" />
                    Previous
                  </motion.button>
                  
                  <div className={cn('px-6 py-4 rounded-xl font-bold', isDark ? 'bg-gray-800/80 text-white' : 'bg-white text-gray-900 shadow-lg')}>
                    Page <span className="text-primary">{page}</span> of {totalPages}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={cn(
                      'px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2',
                      page === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-xl',
                      isDark && page === totalPages ? 'bg-gray-800 text-gray-500' : ''
                    )}
                  >
                    Next
                    <FiChevronDown className="w-5 h-5 rotate-[-90deg]" />
                  </motion.button>
                </motion.div>
              )}
            </>
          ) : (
            /* Empty State - Glassy Design */
            <motion.div
              variants={animationVariants.fadeIn}
              initial="initial"
              animate="animate"
              className="text-center py-20"
            >
              <div className={cn(
                'max-w-md mx-auto p-8 rounded-3xl border-2 shadow-2xl backdrop-blur-xl',
                isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-white/30'
              )}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-blue-600/20 flex items-center justify-center">
                  <FiSearch className="w-10 h-10 text-primary" />
                </div>
                <h3 className={cn('text-2xl font-bold mb-3', textClass)}>
                  No projects found
                </h3>
                <p className={cn('text-base mb-6', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  {search 
                    ? `We couldn't find any projects matching "${search}". Try adjusting your search or filters.`
                    : 'No projects available in this category. Check back soon!'
                  }
                </p>
                {(search || activeFilter) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSearch(''); setActiveFilter(''); setPage(1); }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Clear All Filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* CTA Section - Glassy Design */}
        {!loading && products.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 mb-8 relative z-10"
          >
            <div className={cn(
              'relative p-8 sm:p-12 rounded-3xl border-2 overflow-hidden backdrop-blur-xl',
              isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-white/30'
            )}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-indigo-500/5" />
              <div className="relative z-10 text-center">
                <h2 className={cn('text-3xl sm:text-4xl font-extrabold mb-4', textClass)}>
                  Ready to Start Your Project?
                </h2>
                <p className={cn('text-lg mb-6 max-w-2xl mx-auto', isDark ? 'text-gray-300' : 'text-gray-700')}>
                  Join thousands of students and developers who trust Infinity for their IT project needs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products')}
                    className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    Browse All Projects
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                  {!isAuthenticated && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/register')}
                      className="px-8 py-4 bg-white dark:bg-gray-800 text-primary border-2 border-primary rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      Create Free Account
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
