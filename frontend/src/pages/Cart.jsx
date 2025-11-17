import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiCheck, FiShield, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const layoutClasses = getPageLayoutClasses(isDark);

  if (!cart || cart.items.length === 0) {
    return (
      <PageLayout
        title="Your Cart is Empty"
        subtitle="Start adding IT projects to your cart"
      >
        <div className="flex items-center justify-center py-12 sm:py-16">
          <motion.div
            variants={animationVariants.fadeIn}
            initial="initial"
            animate="animate"
            className={cn(
              'max-w-md mx-auto text-center p-8 rounded-3xl border-2 shadow-xl',
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-blue-600/20 flex items-center justify-center">
              <FiShoppingBag className="text-5xl text-primary" />
            </div>
            <h3 className={cn('text-2xl font-bold mb-3', textClass)}>Your cart is empty</h3>
            <p className={cn('text-base mb-6', textMuted)}>
              Looks like you haven't added any projects yet. Start shopping to fill your cart!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="w-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Browse Projects
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </PageLayout>
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
    <PageLayout
      title="Shopping Cart"
      subtitle={`${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'} in your cart`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <motion.div 
          className="lg:col-span-2 space-y-4"
          variants={animationVariants.slideLeft}
          initial="initial"
          animate="animate"
        >
          {cart.items.map((item, index) => (
            <motion.div
              key={item._id}
              variants={animationVariants.staggerItem}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={cn(
                'rounded-2xl border-2 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300',
                isDark 
                  ? 'bg-gray-800/80 border-gray-700' 
                  : 'bg-white border-gray-200'
              )}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Product Image */}
                <Link 
                  to={`/products/${typeof item.product === 'object' ? item.product._id : item.product}`}
                  className="sm:w-32 sm:h-32 w-full h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${typeof item.product === 'object' ? item.product._id : item.product}`}
                      className="block mb-2"
                    >
                      <h3 className={cn('font-bold text-lg sm:text-xl mb-2 line-clamp-2 hover:text-primary transition-colors', textClass)}>
                        {item.title}
                      </h3>
                    </Link>
                    
                    {/* Price per item */}
                    <p className={cn('text-lg font-bold mb-4', textClass)}>
                      ₹{item.priceINR?.toFixed(2) || item.price?.toFixed(2) || '0.00'}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'flex items-center gap-1 border-2 rounded-xl overflow-hidden',
                        isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
                      )}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={loading || item.quantity === 1}
                          className={cn(
                            'px-4 py-2.5 transition',
                            isDark 
                              ? 'text-gray-300 hover:bg-gray-600 disabled:opacity-50' 
                              : 'text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                          )}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="w-5 h-5" />
                        </motion.button>
                        <span className={cn('px-5 py-2.5 font-bold text-lg min-w-[3rem] text-center', textClass)}>
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={loading}
                          className={cn(
                            'px-4 py-2.5 transition',
                            isDark 
                              ? 'text-gray-300 hover:bg-gray-600' 
                              : 'text-gray-700 hover:bg-gray-200'
                          )}
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item._id)}
                        className={cn(
                          'p-2.5 rounded-xl transition-all',
                          isDark 
                            ? 'text-red-400 hover:bg-red-400/20 hover:border-red-400/50 border-2 border-transparent' 
                            : 'text-red-600 hover:bg-red-50 hover:border-red-200 border-2 border-transparent'
                        )}
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="sm:text-right">
                    <p className={cn('text-xs mb-1', textMuted)}>Total</p>
                    <p className={cn('text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent', textClass)}>
                      ₹{((item.priceINR || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Order Summary - Sticky Sidebar */}
        <motion.div
          variants={animationVariants.slideRight}
          initial="initial"
          animate="animate"
          className="lg:sticky lg:top-20 h-fit"
        >
          <div className={cn(
            'rounded-3xl border-2 p-6 sm:p-8 shadow-xl',
            isDark 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white border-gray-200'
          )}>
            <h2 className={cn('text-2xl sm:text-3xl font-extrabold mb-6', textClass)}>
              Order Summary
            </h2>
            
            {/* Order Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-300 dark:border-gray-700">
                <span className={cn('font-medium', textClass)}>Subtotal ({cart.items.length} items)</span>
                <span className={cn('font-bold text-lg', textClass)}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-300 dark:border-gray-700">
                <span className={cn('font-medium', textClass)}>Tax (5%)</span>
                <span className={cn('font-bold text-lg', textClass)}>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={cn('font-medium', textClass)}>Shipping</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
            </div>

            {/* Total */}
            <div className={cn('border-t-2 pt-4 mb-6', isDark ? 'border-gray-700' : 'border-gray-300')}>
              <div className="flex justify-between items-center">
                <span className={cn('text-xl font-bold', textClass)}>Total</span>
                <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-xl mb-4',
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            )}>
              <FiLock className="w-5 h-5 text-green-500" />
              <span className={cn('text-xs', textMuted)}>Secure checkout with SSL encryption</span>
            </div>

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 text-lg mb-4 relative overflow-hidden group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <FiLock className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Proceed to Checkout</span>
              <FiArrowRight className="w-5 h-5 relative z-10" />
            </motion.button>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/products')}
              className={cn(
                'w-full py-3 rounded-xl font-semibold transition-all duration-300 text-base border-2',
                isDark 
                  ? 'bg-gray-700/50 text-white border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              )}
            >
              Continue Shopping
            </button>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className={textMuted}>Instant download after purchase</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiShield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className={textMuted}>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className={textMuted}>Lifetime support included</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
