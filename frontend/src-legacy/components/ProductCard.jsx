import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiCheck, FiExternalLink, FiPlay, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { generateImageAlt } from '../utils/imageOptimizer';
import toast from 'react-hot-toast';

const ProductCard = memo(function ProductCard({ product }) {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating || 4.5;
  const price = product.priceINR || product.price || 0;
  const originalPrice = product.originalPriceINR || product.originalPrice || 0;
  const demoUrl = product.demoUrl || product.demoVideo || null;

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success('Added to cart! 🎉');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  }, [product._id, addToCart]);

  // Enhanced glassy design with better contrast
  const glassBg = isDark 
    ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
    : 'bg-white/90 backdrop-blur-xl border border-slate-200/50';
  const cardBg = isDark 
    ? 'bg-slate-900/80 backdrop-blur-md' 
    : 'bg-white/95 backdrop-blur-md';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-300' : 'text-slate-600';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className={`relative rounded-2xl overflow-hidden group h-full flex flex-col ${glassBg} shadow-xl hover:shadow-2xl transition-all duration-500`}
      style={{
        boxShadow: isDark 
          ? '0 8px 32px 0 rgba(31, 38, 135, 0.4)' 
          : '0 8px 32px 0 rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-accent-light/0 group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-accent-light/10 transition-all duration-500 pointer-events-none z-0" />
      
      {/* Image Section - Compact */}
      <Link to={`/products/${product.slug || product._id}`} className="relative block" aria-label={`View ${product.title} details`}>
        <div className="relative h-40 sm:h-44 overflow-hidden group/image">
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${
            isDark 
              ? 'from-primary/30 via-accent/30 to-accent-light/30' 
              : 'from-primary-100/50 via-accent-100/50 to-accent-light/50'
          }`} />
          
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={generateImageAlt(product.title, 0, product.category, product.techStack)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-0"
            loading="lazy"
            width={400}
            height={300}
            decoding="async"
          />
          
          {/* Glass overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
          
          {/* Rating Badge - Compact */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 left-2 bg-black/75 backdrop-blur-md border border-white/30 rounded-lg px-2 py-1 flex items-center gap-1 z-20 shadow-lg"
          >
            <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-bold text-xs">{rating.toFixed(1)}</span>
          </motion.div>

          {/* Discount Badge - Compact */}
          {discountPercent > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg px-2 py-1 font-extrabold text-xs shadow-xl z-20 border border-red-400/50"
            >
              -{discountPercent}%
            </motion.div>
          )}

          {/* View Demo Overlay */}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-20 opacity-0 group-hover/image:opacity-100 transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold flex items-center gap-2 shadow-2xl text-sm"
              >
                <FiPlay className="w-4 h-4 text-primary" />
                <span>View Demo</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </motion.div>
            </a>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-30">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-red-600 text-white font-extrabold text-lg px-4 py-2 rounded-lg shadow-2xl border border-red-400/50"
              >
                Out of Stock
              </motion.div>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section - Compact but Readable */}
      <div className={`${cardBg} flex-1 flex flex-col relative z-10`}>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Title - Compact but Clear */}
          <Link to={`/products/${product.slug || product._id}`}>
            <h2 className={`${textClass} font-bold text-base sm:text-lg mb-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300`}>
              {product.title}
            </h2>
          </Link>

          {/* Description - Compact */}
          <p className={`${textMuted} text-xs sm:text-sm mb-2.5 line-clamp-2 leading-relaxed`}>
            {product.description || 'Complete IT project with full source code and documentation.'}
          </p>

          {/* Tech Stack - Compact Pills */}
          {product.techStack && product.techStack.length > 0 && (
            <div className="mb-2.5">
              <div className="flex flex-wrap gap-1.5">
                {product.techStack.slice(0, 3).map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${
                      isDark 
                        ? 'bg-primary/20 text-primary-light border border-primary/30' 
                        : 'bg-primary-100 text-primary border border-primary-200'
                    }`}
                  >
                    {tech}
                  </motion.span>
                ))}
                {product.techStack.length > 3 && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${textSecondary} border ${
                    isDark ? 'border-slate-600' : 'border-slate-300'
                  }`}>
                    +{product.techStack.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price Section - Compact but Prominent */}
          <div className="mt-auto pt-2.5 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-baseline gap-2 flex-wrap">
              {/* Current Price */}
              <span className={`${textClass} text-2xl sm:text-3xl font-extrabold`}>
                ₹{price.toFixed(0)}
              </span>
              {/* Original Price */}
              {originalPrice > 0 && (
                <>
                  <span className={`${textSecondary} text-sm sm:text-base line-through`}>
                    ₹{originalPrice.toFixed(0)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-[10px] sm:text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Section - Compact */}
        <div className={`px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          {/* Primary Buy Button - Compact but Clear */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group/btn ${
              product.stock === 0
                ? 'bg-slate-400 text-white'
                : 'bg-gradient-to-r from-primary via-primary-light to-accent text-white hover:shadow-xl'
            }`}
            aria-label={`Add ${product.title} to cart`}
            type="button"
            style={{
              boxShadow: product.stock === 0 
                ? 'none' 
                : '0 4px 15px 0 rgba(59, 130, 246, 0.5)'
            }}
          >
            {/* Animated gradient overlay */}
            {product.stock !== 0 && (
              <>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-light via-primary to-accent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </>
            )}
            <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            <span className="relative z-10 font-semibold">
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
            {product.stock !== 0 && (
              <FiArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            )}
          </motion.button>

          {/* Secondary Actions Row - Compact */}
          <div className="flex gap-2">
            {/* View Details Button */}
            <Link
              to={`/products/${product.slug || product._id}`}
              className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 border ${
                isDark
                  ? 'bg-slate-800/50 text-slate-100 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              } shadow-sm hover:shadow-md`}
            >
              <span>Details</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* View Demo Button */}
            {demoUrl && (
              <motion.a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 border ${
                  isDark
                    ? 'bg-gray-800/50 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                } shadow-sm hover:shadow-md`}
                aria-label={`View demo of ${product.title}`}
              >
                <FiPlay className="w-3.5 h-3.5 text-primary" />
                <span>Demo</span>
              </motion.a>
            )}
          </div>

          {/* Trust Badges - Compact */}
          <div className="pt-1.5 flex items-center justify-center gap-3 text-[10px] sm:text-xs">
            <div className={`flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <FiCheck className="w-3 h-3" />
              <span className={textMuted}>Instant Download</span>
            </div>
            <div className={`flex items-center gap-1 ${isDark ? 'text-primary-light' : 'text-primary'}`}>
              <FiCheck className="w-3 h-3" />
              <span className={textMuted}>Lifetime Support</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
