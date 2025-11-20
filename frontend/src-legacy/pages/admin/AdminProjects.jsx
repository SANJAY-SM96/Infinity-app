import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { productService } from '../../api/productService';
import { useTheme } from '../../context/ThemeContext';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProjects() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const categories = [
    'all',
    'React Projects',
    'Python Projects',
    'AI/ML Projects',
    'Full-Stack Web Apps',
    'Mini Projects',
    'Final-Year Projects',
    'SaaS Tools',
    'Node.js Projects',
    'Vue.js Projects',
    'Angular Projects',
    'Django Projects',
    'Flask Projects',
    'MERN Stack',
    'MEAN Stack',
    'Mobile Apps',
    'Other'
  ];
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery || undefined
      };
      const response = await productService.getAll(params);
      setProducts(response.data.products || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productService.delete(productId);
      toast.success('Project deleted successfully');
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/projects/edit/${productId}`);
  };

  const handleAdd = () => {
    navigate('/admin/projects/add');
  };

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 ${textClass}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Projects Management
              </span>
            </h1>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage all your products and projects
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-bold hover:shadow-xl transition-all shadow-lg text-sm sm:text-base flex-shrink-0"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full ${inputBg} pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputBg} pl-10 pr-8 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 overflow-hidden`}
        >
          {products.length > 0 ? (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Image</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Title</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Category</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Price</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Stock</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Status</th>
                    <th className={`text-right py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50/50'} transition group`}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                              <FiImage className="w-4 h-4 sm:w-6 sm:h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 min-w-[150px]">
                        <div>
                          <p className={`${textClass} font-semibold text-xs sm:text-sm md:text-base truncate`}>{product.title}</p>
                          <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1`}>
                            {product.description}
                          </p>
                          <span className="md:hidden mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                            {product.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-primary/10 text-primary">
                          {product.category}
                        </span>
                      </td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-4 text-primary font-semibold text-xs sm:text-sm`}>
                        ₹{product.priceINR?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          product.stock > 10 ? 'bg-green-500/10 text-green-500' :
                          product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell">
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          product.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(product._id)}
                            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition ${
                              isDark 
                                ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' 
                                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                            }`}
                            title="Edit"
                          >
                            <FiEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setShowDeleteModal(true);
                            }}
                            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition ${
                              isDark 
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                            }`}
                            title="Delete"
                          >
                            <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className={isDark ? 'text-gray-400 mb-4' : 'text-gray-600 mb-4'}>No products found</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="px-6 py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Add Your First Project
              </motion.button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition text-xs sm:text-sm ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Delete Modal */}
        <AnimatePresence>
          {showDeleteModal && productToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4`}
              >
                <h3 className={`${textClass} text-lg sm:text-xl font-bold mb-2`}>Delete Project</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 sm:mb-6 text-sm sm:text-base`}>
                  Are you sure you want to delete "{productToDelete.title}"? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg sm:rounded-xl font-semibold transition text-sm sm:text-base ${
                      isDark
                        ? 'bg-gray-700 border border-gray-600 text-white hover:bg-gray-600'
                        : 'bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(productToDelete._id)}
                    className="flex-1 px-4 py-2 bg-red-500 rounded-lg sm:rounded-xl text-white font-semibold hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
