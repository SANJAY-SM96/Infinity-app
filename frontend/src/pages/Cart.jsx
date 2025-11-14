import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';

  if (!cart || cart.items.length === 0) {
    return (
      <div className={`min-h-screen ${bgClass} ${textClass} flex items-center justify-center px-4`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FiShoppingBag className="mx-auto mb-4 text-6xl text-gray-400" />
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start adding IT projects to your cart
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
          >
            Continue Shopping
            <FiArrowRight />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    const result = await updateCartItem(itemId, newQuantity);
    if (!result.success) {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleRemove = async (itemId) => {
    setLoading(true);
    const result = await removeFromCart(itemId);
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success('Item removed');
    }
    setLoading(false);
  };

  const subtotal = cart.total;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div 
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {cart.items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${cardBg} border rounded-2xl p-6 flex gap-6`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className={`${textClass} font-bold text-lg mb-2`}>{item.title}</h3>
                  <p className="text-primary font-bold text-xl mb-4">₹{item.priceINR?.toFixed(2) || item.price?.toFixed(2) || '0.00'}</p>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 border rounded-xl ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={loading || item.quantity === 1}
                        className={`px-3 py-1 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} disabled:opacity-50 rounded-l-xl transition`}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className={`px-4 ${textClass} font-semibold`}>{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={loading}
                        className={`px-3 py-1 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-r-xl transition`}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`${textClass} font-bold text-xl mb-4`}>
                    ₹{((item.priceINR || item.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className={`p-2 rounded-xl transition ${
                      isDark 
                        ? 'text-red-400 hover:bg-red-400/10' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${cardBg} border rounded-2xl p-6 h-fit sticky top-20`}
          >
            <h2 className={`${textClass} text-2xl font-bold mb-6`}>Order Summary</h2>
            
            <div className={`space-y-3 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-500 font-semibold">Free</span>
              </div>
            </div>

            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} pt-4 mb-6`}>
              <div className="flex justify-between text-2xl font-bold text-primary">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all mb-3 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <FiArrowRight />
            </motion.button>

            <button
              onClick={() => navigate('/products')}
              className={`w-full border ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-semibold py-3 rounded-xl transition`}
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
