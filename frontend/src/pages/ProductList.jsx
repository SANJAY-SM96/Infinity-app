import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiX } from 'react-icons/fi';
import { PRODUCT_FILTERS } from '../utils/constants';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) setActiveFilter(filterParam);
  }, [searchParams]);

  useEffect(() => { fetchProducts(); }, [page, search, activeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      // Use specific filter endpoints
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
      
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              IT Projects Marketplace
            </span>
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse ready-made IT and web-based projects
          </p>
        </motion.div>

        {/* Filter Buttons - No Category Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveFilter(''); setPage(1); }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeFilter === ''
                  ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg'
                  : isDark
                  ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Projects
            </motion.button>
            {PRODUCT_FILTERS.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveFilter(filter.id); setPage(1); }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search IT projects..."
              className={`w-full ${inputBg} pl-12 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="w-full">
          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product, index) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-6 py-2 rounded-xl font-semibold transition ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50'
                        : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
                    }`}
                  >
                    Previous
                  </motion.button>
                  <span className={`px-6 py-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Page {page} of {totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`px-6 py-2 rounded-xl font-semibold transition ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50'
                        : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
                    }`}
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
