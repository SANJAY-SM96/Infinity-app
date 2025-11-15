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
          const response = await productService.getById(item.product);
          products[item.product] = response.data.product;
        } catch (error) {
          console.error(`Failed to fetch product ${item.product}:`, error);
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

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
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
    const price = getPriceInCurrency(item.price, item.product);
    return sum + (price * item.quantity);
  }, 0);

  const tax = subtotal * 0.05;
  const shipping = subtotal > 83000 ? 0 : 8300; // Free shipping above ₹83,000
  const total = subtotal + tax + shipping;

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
        items: cart.items.map(item => ({
          ...item,
          price: getPriceInCurrency(item.price, item.product)
        })),
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

      // Get Razorpay key
      const keyResponse = await paymentService.razorpay.getKey();
      const razorpayKey = keyResponse.data.key;

      // Create Razorpay order
      const orderResponse = await paymentService.razorpay.createOrder({
        total: amount,
        orderId: order._id,
        currency: 'INR'
      });

      const razorpayOrderId = orderResponse.data.orderId;
      const amountInPaise = Math.round(amount * 100);

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
            // Verify payment on backend
            await paymentService.razorpay.verifyPayment({
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            toast.success('Payment successful!');
            await clearCart();
            navigate(`/dashboard/orders/${order._id}`);
          } catch (error) {
            toast.error('Payment verification failed');
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
      toast.error('Payment initialization failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setProcessingPayment(false);
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
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} pt-24 pb-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Complete your order securely
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form & Payment */}
          <motion.form 
            id="checkout-form"
            onSubmit={handlePlaceOrder} 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Payment Method - INR Only */}
            <div className={`${cardBg} border rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <FiGlobe className="text-primary" size={20} />
                <h3 className={`${textClass} text-lg font-bold`}>Payment Method</h3>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                >
                  <option value="razorpay">Razorpay (UPI/Card/Net Banking) - ₹</option>
                  <option value="cod">Cash on Delivery - ₹</option>
                </select>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  All prices are in Indian Rupees (₹)
                </p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className={`${cardBg} border rounded-2xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <FiLock className="text-primary" size={24} />
                <h2 className={`${textClass} text-2xl font-bold`}>Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    placeholder="+91 1234567890"
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Address Line 1</label>
                  <input
                    type="text"
                    name="line1"
                    value={shippingInfo.line1}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Address Line 2 (optional)</label>
                  <input
                    type="text"
                    name="line2"
                    value={shippingInfo.line2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>Country</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleChange}
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${cardBg} border rounded-2xl p-6 h-fit sticky top-20`}
          >
            <h2 className={`${textClass} text-2xl font-bold mb-6`}>Order Summary</h2>

            <div className={`space-y-3 mb-6 max-h-64 overflow-y-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {cart.items.map((item) => {
                const price = getPriceInCurrency(item.price, item.product);
                return (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span>{getCurrencySymbol()}{(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} pt-4 space-y-2 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>{getCurrencySymbol()}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-semibold">Free</span>
                  ) : (
                    `${getCurrencySymbol()}${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} pt-4`}>
              <div className="flex justify-between text-2xl font-bold text-primary">
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
              className="w-full mt-6 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading || processingPayment ? (
                'Processing...'
              ) : (
                <>
                  <FiLock size={20} />
                  {paymentMethod === 'cod' ? 'Place Order' : `Pay ${getCurrencySymbol()}${total.toFixed(2)}`}
                  <FiArrowRight />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
