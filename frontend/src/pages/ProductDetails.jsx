import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../api/productService';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Loader from '../components/Loader';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error);
    }
  };

  if (loading) return <Loader />;
  if (!product) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="text-center">
        <p className="text-xl mb-4">Product not found</p>
        <button onClick={() => navigate('/products')} className="text-primary hover:underline">
          Back to Products
        </button>
      </div>
    </div>
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.button
          onClick={() => navigate('/products')}
          className={`flex items-center gap-2 mb-6 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft /> Back to Products
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className={`${cardBg} border rounded-2xl overflow-hidden`}>
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <motion.img
                    key={idx}
                    src={img}
                    alt={`view-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                      selectedImage === idx ? 'border-primary' : isDark ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${textClass}`}>
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      size={20} 
                    />
                  ))}
                </div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price - Only INR */}
              <div className="flex items-baseline gap-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">
                    ₹{product.priceINR?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {(product.originalPriceINR || product.originalPrice) && (
                  <>
                    <span className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-500'} line-through`}>
                      ₹{(product.originalPriceINR || product.originalPrice)?.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500/10 text-red-500">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className={`text-lg font-semibold mb-6 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of Stock'}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className={`${textClass} font-bold text-xl mb-3`}>Description</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {product.description}
              </p>
            </div>

            {/* Demo Video */}
            {product.demoVideo && (
              <div className={`${cardBg} border rounded-2xl p-6`}>
                <h3 className={`${textClass} font-bold text-xl mb-4`}>Demo Video</h3>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={product.demoVideo.replace('watch?v=', 'embed/')}
                    title="Demo Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {product.techStack && product.techStack.length > 0 && (
              <div className={`${cardBg} border rounded-2xl p-6`}>
                <h3 className={`${textClass} font-bold text-xl mb-4`}>Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className={`${cardBg} border rounded-2xl p-6`}>
                <h3 className={`${textClass} font-bold text-xl mb-4`}>Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className={`${cardBg} border rounded-2xl p-6`}>
                <h3 className={`${textClass} font-bold text-xl mb-4`}>Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{key}:</span>
                      <span className={`${textClass} ml-2 font-semibold`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center border rounded-xl ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`px-4 py-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition rounded-l-xl`}
                    >
                      <FiMinus size={20} />
                    </button>
                    <span className={`px-6 ${textClass} font-bold text-lg`}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className={`px-4 py-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition rounded-r-xl`}
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={20} />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            )}

            {/* Info */}
            <div className={`${cardBg} border rounded-2xl p-6 space-y-3 text-sm`}>
              {product.warranty && (
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Warranty:</span>
                  <span className="text-primary font-semibold">{product.warranty}</span>
                </div>
              )}
              {product.returnsPolicy && (
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Returns:</span>
                  <span className="text-primary font-semibold">{product.returnsPolicy}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
