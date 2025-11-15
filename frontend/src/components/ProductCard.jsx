import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating || 4.5;
  const price = product.priceINR || product.price || 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`${cardBg} border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group`}
    >
      <Link to={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercent}%
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <FiStar className="fill-current" size={14} />
            {rating.toFixed(1)}
          </div>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className={`${textClass} font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors`}>
            {product.title}
          </h3>

          {/* Description */}
          <p className={`${textMuted} text-sm mb-4 line-clamp-2 h-10`}>
            {product.description}
          </p>

          {/* Tech Stack */}
          {product.techStack && product.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold border border-primary/20"
                >
                  {tech}
                </span>
              ))}
              {product.techStack.length > 3 && (
                <span className={`px-3 py-1 ${textMuted} rounded-full text-xs`}>
                  +{product.techStack.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className={`${textClass} text-2xl font-bold`}>
                ₹{price.toFixed(2)}
              </span>
              {product.originalPriceINR || product.originalPrice ? (
                <span className={`${textMuted} text-sm line-through ml-2`}>
                  ₹{(product.originalPriceINR || product.originalPrice)?.toFixed(2)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FiShoppingCart size={18} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
