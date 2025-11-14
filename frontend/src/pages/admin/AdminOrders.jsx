import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { orderService } from '../../api/orderService';
import { FiSearch, FiEye, FiEdit, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statuses = ['all', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll({ page: currentPage, limit: itemsPerPage });
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
      await orderService.updateStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order status');
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
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Orders Management
            </span>
          </h1>
          <p className={isDark ? 'text-white/60' : 'text-gray-600'}>View and manage all customer orders for IT projects</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-light border border-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-8 py-2 bg-dark-light border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
            >
              {statuses.map(status => (
                <option key={status} value={status} className="bg-dark-light">
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
          className="bg-gradient-to-br from-dark-light to-dark-lighter rounded-xl p-6 border border-primary/20 overflow-hidden"
        >
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Items</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Payment</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Date</th>
                    <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-primary/10 hover:bg-dark/50 transition"
                    >
                      <td className="py-3 px-4 text-white text-sm font-mono">#{order._id.slice(-8)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white text-sm font-medium">{order.user?.name || 'N/A'}</p>
                          <p className="text-white/40 text-xs">{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-sm">{order.items?.length || 0} items</td>
                      <td className="py-3 px-4 text-cyan-400 font-semibold">₹{order.total?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentInfo?.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-400' :
                          order.paymentInfo?.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {order.paymentInfo?.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                            order.orderStatus === 'Confirmed' ? 'bg-cyan-500/20 text-cyan-400' :
                            order.orderStatus === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {statuses.filter(s => s !== 'all').map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {/* View order details */}}
                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition"
                            title="View"
                          >
                            <FiEye size={16} />
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
              <p className="text-white/40">No orders found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-primary/20">
              <p className="text-white/60 text-sm">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-dark-light border border-primary/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-dark-light border border-primary/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}

