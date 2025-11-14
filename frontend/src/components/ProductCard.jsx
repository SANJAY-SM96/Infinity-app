import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-dark-light rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      <Link to={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-dark">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-accent text-dark px-2 py-1 rounded-md text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mt-2 gap-1">
            <div className="text-xs text-yellow-400">★ {product.rating || 0}</div>
          </div>

          {/* Price - Only INR */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-primary">
              ₹{product.priceINR?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
            </span>
            {product.originalPriceINR || product.originalPrice ? (
              <span className="text-sm text-gray-400 line-through">
                ₹{(product.originalPriceINR || product.originalPrice)?.toFixed(2)}
              </span>
            ) : null}
          </div>

          {/* Tech Stack Preview */}
          {product.techStack && product.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
              {product.techStack.length > 3 && (
                <span className="px-2 py-1 text-gray-400 text-xs">+{product.techStack.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="flex-1 bg-primary text-dark py-2 rounded-md text-xs font-bold hover:bg-blue-400 transition-colors flex items-center justify-center gap-1">
          <FiShoppingCart size={14} /> Add
        </button>
        <button className="px-3 py-2 bg-dark-lighter border border-primary text-primary rounded-md hover:bg-primary hover:text-dark transition-colors">
          <FiHeart size={14} />
        </button>
        <button className="px-3 py-2 bg-dark-lighter border border-primary text-primary rounded-md hover:bg-primary hover:text-dark transition-colors">
          <FiEye size={14} />
        </button>
      </div>
    </motion.div>
  );
}
