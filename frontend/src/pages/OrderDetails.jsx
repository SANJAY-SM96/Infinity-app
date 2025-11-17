import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { orderService } from '../api/orderService';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiDownload, 
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle
} from 'react-icons/fi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
      navigate('/dashboard/customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (orderId, productId) => {
    // In production, this would download the actual project files
    toast.success('Download started!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipped':
        return <FiTruck className="w-5 h-5 text-blue-500" />;
      case 'Confirmed':
        return <FiCheckCircle className="w-5 h-5 text-cyan-500" />;
      case 'Processing':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'Cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiPackage className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Confirmed':
        return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30';
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const layoutClasses = getPageLayoutClasses(isDark);
  const { textClass, textMuted, bgClass } = layoutClasses;

  if (loading) {
    return (
      <PageLayout title="Order Details" subtitle="Loading order information...">
        <Loader />
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout title="Order Not Found" subtitle="The order you're looking for doesn't exist">
        <div className="text-center py-12">
          <p className={textMuted}>Order not found or you don't have permission to view it.</p>
          <Link
            to="/dashboard/customer"
            className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Order Details" subtitle={`Order #${order._id.slice(-8)}`}>
      <div className="space-y-6">
        {/* Back Button */}
        <motion.div
          variants={animationVariants.fadeIn}
          initial="initial"
          animate="animate"
        >
          <button
            onClick={() => {
              if (user?.userType === 'customer') {
                navigate('/dashboard/customer');
              } else if (user?.userType === 'student') {
                navigate('/dashboard/student');
              } else {
                navigate('/dashboard');
              }
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              isDark
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-700 hover:text-primary hover:bg-primary/10'
            )}
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Order Status Card */}
        <motion.div
          variants={animationVariants.fadeIn}
          initial="initial"
          animate="animate"
          className={cn(commonClasses.card(isDark), 'p-6')}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(order.orderStatus)}
              <div>
                <h3 className={`text-lg font-bold ${textClass}`}>Order Status</h3>
                <p className={`text-sm ${textMuted}`}>
                  {order.orderStatus}
                </p>
              </div>
            </div>
            <span className={cn(
              'px-4 py-2 rounded-lg border font-semibold text-sm',
              getStatusColor(order.orderStatus)
            )}>
              {order.orderStatus}
            </span>
          </div>
          {order.trackingNumber && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className={`text-sm ${textMuted}`}>
                Tracking Number: <span className={textClass}>{order.trackingNumber}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Order Items */}
        <motion.div
          variants={animationVariants.fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className={cn(commonClasses.card(isDark), 'p-6')}
        >
          <h3 className={`text-lg font-bold mb-4 ${textClass}`}>Order Items</h3>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border',
                    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-base ${textClass}`}>
                        {item.title || item.name || 'Product'}
                      </h4>
                      <p className={`text-sm mt-1 ${textMuted}`}>
                        Quantity: {item.quantity || 1}
                      </p>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title || 'Product'}
                          className="mt-2 w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${textClass}`}>
                          ₹{(item.price || 0) * (item.quantity || 1)}
                        </p>
                        <p className={`text-sm ${textMuted}`}>
                          ₹{item.price || 0} each
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(order._id, item.product?._id || item.product)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg flex items-center gap-2 text-sm"
                      >
                        <FiDownload className="w-4 h-4" />
                        Download
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={textMuted}>No items found in this order.</p>
            )}
          </div>
        </motion.div>

        {/* Shipping Information */}
        {order.shippingInfo && (
          <motion.div
            variants={animationVariants.fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className={cn(commonClasses.card(isDark), 'p-6')}
          >
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="w-5 h-5 text-primary" />
              <h3 className={`text-lg font-bold ${textClass}`}>Shipping Information</h3>
            </div>
            <div className="space-y-2">
              <p className={textClass}>
                <span className={textMuted}>Name:</span> {order.shippingInfo.fullName}
              </p>
              {order.shippingInfo.phone && (
                <p className={textClass}>
                  <span className={textMuted}>Phone:</span> {order.shippingInfo.phone}
                </p>
              )}
              {order.shippingInfo.line1 && (
                <p className={textClass}>
                  <span className={textMuted}>Address:</span> {order.shippingInfo.line1}
                  {order.shippingInfo.line2 && `, ${order.shippingInfo.line2}`}
                </p>
              )}
              {(order.shippingInfo.city || order.shippingInfo.state || order.shippingInfo.postalCode) && (
                <p className={textClass}>
                  {order.shippingInfo.city && `${order.shippingInfo.city}, `}
                  {order.shippingInfo.state && `${order.shippingInfo.state} `}
                  {order.shippingInfo.postalCode && order.shippingInfo.postalCode}
                </p>
              )}
              {order.shippingInfo.country && (
                <p className={textClass}>
                  <span className={textMuted}>Country:</span> {order.shippingInfo.country}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Payment Information */}
        <motion.div
          variants={animationVariants.fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className={cn(commonClasses.card(isDark), 'p-6')}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiCreditCard className="w-5 h-5 text-primary" />
            <h3 className={`text-lg font-bold ${textClass}`}>Payment Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={textMuted}>Payment Method:</span>
              <span className={textClass}>
                {order.paymentInfo?.provider?.toUpperCase() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={textMuted}>Payment Status:</span>
              <span className={cn(
                'px-2 py-1 rounded text-xs font-semibold',
                order.paymentInfo?.paymentStatus === 'completed'
                  ? 'bg-green-500/20 text-green-500'
                  : order.paymentInfo?.paymentStatus === 'failed'
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-yellow-500/20 text-yellow-500'
              )}>
                {order.paymentInfo?.paymentStatus?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            {order.paymentInfo?.transactionId && (
              <div className="flex justify-between">
                <span className={textMuted}>Transaction ID:</span>
                <span className={textClass}>{order.paymentInfo.transactionId}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          variants={animationVariants.fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className={cn(commonClasses.card(isDark), 'p-6 bg-gradient-to-r', isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-blue-50/50 to-indigo-50/50')}
        >
          <h3 className={`text-lg font-bold mb-4 ${textClass}`}>Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={textMuted}>Subtotal:</span>
              <span className={textClass}>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className={textMuted}>Tax:</span>
                <span className={textClass}>₹{order.tax.toFixed(2)}</span>
              </div>
            )}
            {order.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className={textMuted}>Shipping:</span>
                <span className={textClass}>₹{order.shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-700">
              <span className={`font-bold text-lg ${textClass}`}>Total:</span>
              <span className={`font-bold text-lg text-primary`}>₹{order.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className={`text-sm ${textMuted}`}>
              Order Date: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}

