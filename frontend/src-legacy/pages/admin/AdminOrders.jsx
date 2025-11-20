import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { orderService } from '../../api/orderService';
import { useTheme } from '../../context/ThemeContext';
import { FiSearch, FiEye, FiEdit, FiFilter, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const { isDark } = useTheme();

  const statuses = ['all', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllAdmin({ page: currentPage, limit: itemsPerPage });
      let filteredOrders = response.data.orders || [];
      
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.orderStatus === statusFilter);
      }
      
      if (searchQuery) {
        filteredOrders = filteredOrders.filter(order =>
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setOrders(filteredOrders);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      // Update selected order if it's open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = async (orderId) => {
    // Prevent multiple simultaneous requests for the same order
    if (loadingDetails || loadingOrderId === orderId) {
      return;
    }

    // If the order is already selected and modal is open, just show it
    if (selectedOrder && selectedOrder._id === orderId && showDetailsModal) {
      return;
    }

    try {
      setLoadingDetails(true);
      setLoadingOrderId(orderId);
      const response = await orderService.getById(orderId);
      setSelectedOrder(response.data.order);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error('Failed to load order details');
      }
    } finally {
      setLoadingDetails(false);
      setLoadingOrderId(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Orders Management
            </span>
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-white/60' : 'text-gray-600'}`}>View and manage all customer orders for IT projects</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-primary/50' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary/50'
              }`}
            />
          </div>
          <div className="relative">
            <FiFilter className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`pl-10 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {statuses.map(status => (
                <option key={status} value={status} className={isDark ? 'bg-gray-800' : 'bg-white'}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 overflow-hidden`}
        >
          {orders.length > 0 ? (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Order ID</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Customer</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Items</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Amount</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Payment</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Status</th>
                    <th className={`text-left py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Date</th>
                    <th className={`text-right py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50/50'} transition`}
                    >
                      <td className={`py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-white' : 'text-gray-900'} text-xs sm:text-sm font-mono`}>#{order._id.slice(-8)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 min-w-[120px]">
                        <div>
                          <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-xs sm:text-sm font-medium truncate`}>{order.user?.name || 'N/A'}</p>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-[10px] sm:text-xs truncate`}>{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>{order.items?.length || 0} items</td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'} font-semibold text-xs sm:text-sm`}>₹{order.total?.toFixed(2) || '0.00'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                        <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          order.paymentInfo?.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-500' :
                          order.paymentInfo?.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {order.paymentInfo?.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border-0 cursor-pointer ${
                            order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                            order.orderStatus === 'Confirmed' ? 'bg-cyan-500/20 text-cyan-500' :
                            order.orderStatus === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {statuses.filter(s => s !== 'all').map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-4 hidden lg:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleViewDetails(order._id)}
                            disabled={loadingDetails && loadingOrderId === order._id}
                            className={`p-1.5 sm:p-2 rounded-lg transition ${
                              loadingDetails && loadingOrderId === order._id
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            } ${
                              isDark 
                                ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' 
                                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                            }`}
                            title="View Order Details"
                          >
                            {loadingDetails && loadingOrderId === order._id ? (
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
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
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No orders found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
          >
            <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Order Details - #{selectedOrder._id.slice(-8)}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Order ID</p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-mono text-sm`}>#{selectedOrder._id.slice(-8)}</p>
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Status</p>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium border-0 cursor-pointer ${
                      selectedOrder.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                      selectedOrder.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                      selectedOrder.orderStatus === 'Confirmed' ? 'bg-cyan-500/20 text-cyan-500' :
                      selectedOrder.orderStatus === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {statuses.filter(s => s !== 'all').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Customer</p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{selectedOrder.user?.name || 'N/A'}</p>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{selectedOrder.user?.email || ''}</p>
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Amount</p>
                  <p className={`${isDark ? 'text-cyan-400' : 'text-blue-600'} font-bold text-lg`}>₹{selectedOrder.total?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Payment Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.paymentInfo?.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-500' :
                    selectedOrder.paymentInfo?.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {selectedOrder.paymentInfo?.paymentStatus || 'pending'}
                  </span>
                </div>
                <div>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Order Date</p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.product?.title || item.name || 'Product'}
                          </p>
                          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>
                        <p className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              {selectedOrder.shippingInfo && (
                <div>
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Information</h3>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>
                      {selectedOrder.shippingInfo.fullName}
                    </p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {selectedOrder.shippingInfo.line1}
                      {selectedOrder.shippingInfo.line2 && `, ${selectedOrder.shippingInfo.line2}`}
                    </p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.postalCode}
                    </p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {selectedOrder.shippingInfo.country}
                    </p>
                    {selectedOrder.shippingInfo.phone && (
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2`}>
                        Phone: {selectedOrder.shippingInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

