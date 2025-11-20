import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { orderService } from '../api/orderService';
import { paymentService } from '../api/paymentService';
import { productService } from '../api/productService';
import { FiLock, FiCheck, FiArrowRight, FiDollarSign, FiCreditCard, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

// Currency conversion rate (USD to INR) - in production, fetch from API
const USD_TO_INR = 83;

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedCurrency] = useState('INR'); // Always INR
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // Always Razorpay for INR
  const [productsData, setProductsData] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
                    country: 'IN'
  });

  // Fetch product details for currency info
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || !cart.items) return;
      
      const products = {};
      for (const item of cart.items) {
        try {
          // Handle both cases: item.product could be an object (populated) or a string ID
          const productId = typeof item.product === 'object' && item.product !== null 
            ? item.product._id || item.product.id 
            : item.product;
          
          if (!productId) {
            if (import.meta.env.DEV) {
              console.warn('Product ID not found for item:', item);
            }
            continue;
          }
          
          const response = await productService.getById(productId);
          products[productId] = response.data.product;
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error(`Failed to fetch product ${item.product}:`, error);
          }
        }
      }
      setProductsData(products);
    };

    fetchProductDetails();
  }, [cart]);

  // Load Razorpay script
  useEffect(() => {
    if (selectedCurrency === 'INR' && !razorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [selectedCurrency, razorpayLoaded]);

  // Always use INR
  useEffect(() => {
    setPaymentMethod('razorpay');
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  // Calculate prices in INR only
  const getPriceInCurrency = (price, product) => {
    // Always use priceINR if available, otherwise use price (assumed to be in INR)
    const productData = productsData[product];
    if (productData?.priceINR) {
      return productData.priceINR;
    }
    return price; // Assume price is already in INR
  };

  const getCurrencySymbol = () => '₹'; // Always INR

  const subtotal = cart.items.reduce((sum, item) => {
    // Handle both cases: item.product could be an object (populated) or a string ID
    const productId = typeof item.product === 'object' && item.product !== null 
      ? item.product._id || item.product.id 
      : item.product;
    const price = getPriceInCurrency(item.price, productId);
    return sum + (price * item.quantity);
  }, 0);

  // No tax or shipping - just show project cost
  const tax = 0;
  const shipping = 0;
  const total = subtotal; // Total is just the subtotal (project cost)

  // Theme-based styling
  const cardBg = isDark 
    ? 'bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border-slate-700/50' 
    : 'bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95 backdrop-blur-xl border-slate-200/80';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const inputBg = isDark 
    ? 'bg-gray-800/50 text-white border-gray-600' 
    : 'bg-white text-gray-900 border-gray-300';

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  // Currency is always INR, no change handler needed

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order first
      const orderData = {
        items: cart.items.map(item => {
          // Handle both cases: item.product could be an object (populated) or a string ID
          const productId = typeof item.product === 'object' && item.product !== null 
            ? item.product._id || item.product.id 
            : item.product;
          
          return {
            ...item,
            product: productId, // Ensure we send the ID, not the object
            price: getPriceInCurrency(item.price, productId)
          };
        }),
        shippingInfo,
        currency: 'INR', // Always INR
        paymentMethod
      };

      const orderResponse = await orderService.create(orderData);
      const order = orderResponse.data.order;

      // Process payment based on selected method
      if (paymentMethod === 'stripe') {
        await processStripePayment(order, total);
      } else if (paymentMethod === 'razorpay') {
        await processRazorpayPayment(order, total);
      } else {
        // COD or other methods
        toast.success('Order placed successfully!');
        await clearCart();
        navigate(`/dashboard/orders/${order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const processStripePayment = async (order, amount) => {
    try {
      setProcessingPayment(true);
      
      // Create payment intent
      const { data } = await paymentService.stripe.createPaymentIntent({
        total: amount,
        orderId: order._id,
        currency: 'inr'
      });

      // Here you would integrate Stripe Elements
      // For now, we'll just confirm the payment
      toast.success('Redirecting to payment...');
      // In production, use Stripe Elements or Stripe Checkout
      toast.info('Stripe payment integration pending');
    } catch (error) {
      toast.error('Payment failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const processRazorpayPayment = async (order, amount) => {
    try {
      setProcessingPayment(true);

      // Validate order and amount
      if (!order || !order._id) {
        throw new Error('Order not found. Please try again.');
      }

      if (!amount || amount <= 0 || isNaN(amount)) {
        throw new Error('Invalid order amount. Please try again.');
      }

      // Get Razorpay key
      const keyResponse = await paymentService.razorpay.getKey();
      const razorpayKey = keyResponse.data.key;

      if (!razorpayKey) {
        throw new Error('Payment gateway configuration error. Please contact support.');
      }

      // Create Razorpay order
      const orderResponse = await paymentService.razorpay.createOrder({
        total: amount,
        orderId: order._id,
        currency: 'INR'
      });

      if (!orderResponse.data || !orderResponse.data.orderId) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      const razorpayOrderId = orderResponse.data.orderId;
      const amountInPaise = Math.round(amount * 100);

      if (!razorpayOrderId || amountInPaise <= 0) {
        throw new Error('Invalid payment order details. Please try again.');
      }

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: 'INR',
        name: 'Infinity App',
        description: `Order #${order._id}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            if (import.meta.env.DEV) {
              console.log('Razorpay payment response:', response);
            }
            
            // Validate Razorpay response
            if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response from Razorpay. Missing required fields.');
            }

            // Verify payment on backend - send both formats for compatibility
            const payload = {
              orderId: order._id,
              // Send in both camelCase and snake_case for backend compatibility
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              // Also send snake_case format
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };
            
            if (import.meta.env.DEV) {
              console.log('Sending verification payload:', {
                orderId: payload.orderId,
                hasRazorpayOrderId: !!payload.razorpayOrderId,
                hasRazorpayPaymentId: !!payload.razorpayPaymentId,
                hasRazorpaySignature: !!payload.razorpaySignature,
                signaturePreview: payload.razorpaySignature?.substring(0, 20) + '...'
              });
            }
            
            const verifyResponse = await paymentService.razorpay.verifyPayment(payload);

            if (verifyResponse.data?.success) {
              toast.success('Payment successful!');
              await clearCart();
              navigate(`/dashboard/orders/${order._id}`);
            } else {
              throw new Error(verifyResponse.data?.message || 'Payment verification failed');
            }
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error('Payment verification error:', error);
              console.error('Error response:', error.response?.data);
            }
            const errorMessage = error.response?.data?.message || error.message || 'Payment verification failed. Please contact support.';
            toast.error(errorMessage);
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: shippingInfo.fullName,
          email: user?.email || '',
          contact: shippingInfo.phone
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Razorpay payment error:', error);
      }
      const errorMessage = error.response?.data?.message || error.message || 'Payment initialization failed. Please try again.';
      toast.error(errorMessage);
      
      // If it's an authentication error, the interceptor will handle redirect
      if (error.response?.status === 401) {
        return;
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const layoutClasses = getPageLayoutClasses(isDark);

  return (
    <PageLayout
      title="Checkout"
      subtitle="Complete your order"
      showBackButton={true}
      backPath="/cart"
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Shipping Form & Payment */}
          <motion.form 
            id="checkout-form"
            onSubmit={handlePlaceOrder} 
            className="lg:col-span-2 space-y-4 sm:space-y-6"
            variants={animationVariants.slideLeft}
            initial="initial"
            animate="animate"
          >
            {/* Payment Method - INR Only */}
            <div className={commonClasses.card(isDark)}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FiGlobe className="text-primary sm:w-5 sm:h-5" size={18} />
                <h3 className={cn(commonClasses.heading3(isDark), 'text-base sm:text-lg')}>Payment Method</h3>
              </div>
              <div>
                <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                >
                  <option value="razorpay">Razorpay (UPI/Card/Net Banking) - ₹</option>
                  <option value="cod">Cash on Delivery - ₹</option>
                </select>
                <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  All prices are in Indian Rupees (₹)
                </p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                <FiLock className="text-primary sm:w-5 sm:h-5 md:w-6 md:h-6" size={18} />
                <h2 className={`${textClass} text-lg sm:text-xl md:text-2xl font-bold`}>Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    placeholder="+91 1234567890"
                    required
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>Address Line 1</label>
                  <input
                    type="text"
                    name="line1"
                    value={shippingInfo.line1}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>Address Line 2 (optional)</label>
                  <input
                    type="text"
                    name="line2"
                    value={shippingInfo.line2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    required
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    required
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-semibold mb-2 ${textClass}`}>Country</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleChange}
                    className={`w-full ${inputBg} px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
                  >
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

          </motion.form>

          {/* Order Summary */}
          <motion.div
            variants={animationVariants.slideRight}
            initial="initial"
            animate="animate"
            className={cn(commonClasses.card(isDark), 'h-fit lg:sticky lg:top-20')}
          >
            <h2 className={cn(commonClasses.heading2(isDark), 'text-xl sm:text-2xl mb-4 sm:mb-6')}>Order Summary</h2>

            <div className={cn('space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto text-xs sm:text-sm', commonClasses.textBody(isDark))}>
              {cart.items.map((item) => {
                const price = getPriceInCurrency(item.price, item.product);
                return (
                  <div key={item._id} className="flex justify-between">
                    <span className="truncate pr-2">{item.title} x{item.quantity}</span>
                    <span className="flex-shrink-0">{getCurrencySymbol()}{(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className={cn('border-t pt-3 sm:pt-4 mb-3 sm:mb-4 text-sm sm:text-base', isDark ? 'border-gray-700' : 'border-gray-300', commonClasses.textBody(isDark))}>
              {/* Tax and shipping removed - showing only project cost */}
            </div>

            <div className={cn('border-t pt-3 sm:pt-4', isDark ? 'border-gray-700' : 'border-gray-300')}>
              <div className="flex justify-between text-xl sm:text-2xl font-bold text-primary">
                <span>Total:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              form="checkout-form"
              disabled={loading || processingPayment}
              className={cn(commonClasses.buttonPrimary(isDark), 'w-full mt-4 sm:mt-6 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base')}
            >
              {loading || processingPayment ? (
                <>
                  <div className={commonClasses.spinner('sm')} />
                  Processing...
                </>
              ) : (
                <>
                  <FiLock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{paymentMethod === 'cod' ? 'Place Order' : `Pay ${getCurrencySymbol()}${total.toFixed(2)}`}</span>
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </PageLayout>
  );
}
