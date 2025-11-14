import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { projectRequestService } from '../../api/projectRequestService';
import { useTheme } from '../../context/ThemeContext';
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiX, FiEye, FiCheck, FiXCircle, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProjectRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { isDark } = useTheme();

  const statuses = ['all', 'pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'];
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter, searchQuery]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined
      };
      const response = await projectRequestService.getAll(params);
      
      // Handle both 'projectRequests' and 'requests' response format
      // Backend returns 'requests', but we support both for compatibility
      const fetchedRequests = response.data.requests || response.data.projectRequests || [];
      setRequests(fetchedRequests);
      setTotalPages(response.data.pagination?.pages || 1);
      
      // Log for debugging
      console.log('Project requests API response:', response.data);
      console.log('Fetched requests count:', fetchedRequests.length);
      console.log('Total requests:', response.data.pagination?.total || 0);
      
      // Show helpful message if no requests found
      if (fetchedRequests.length === 0 && !searchQuery && statusFilter === 'all') {
        console.log('💡 No project requests found. Submit a request via "Build My Project" form on the homepage.');
      }
    } catch (error) {
      console.error('❌ Failed to fetch project requests:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Show more specific error message
      if (error.response?.status === 401) {
        toast.error('You must be logged in as admin to view project requests');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view project requests. Please login as admin.');
      } else if (error.response?.status === 404) {
        toast.error('Project requests endpoint not found. Check backend server.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load project requests. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await projectRequestService.update(id, { status });
      toast.success('Status updated successfully');
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project request?')) {
      return;
    }
    try {
      await projectRequestService.delete(id);
      toast.success('Project request deleted successfully');
      fetchRequests();
    } catch (error) {
      console.error('Failed to delete project request:', error);
      toast.error('Failed to delete project request');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  if (loading && requests.length === 0) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'quoted':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'accepted':
        return 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 ${textClass}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Project Requests
              </span>
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Manage customer project requests and requirements
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search project requests..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full ${inputBg} pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputBg} pl-10 pr-8 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer`}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardBg} border rounded-2xl p-6 overflow-hidden`}
        >
          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Project Title</th>
                    <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Customer</th>
                    <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Domain</th>
                    <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Budget</th>
                    <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Status</th>
                    <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Date</th>
                    <th className={`text-right py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50/50'} transition group`}
                    >
                      <td className="py-3 px-4">
                        <p className={`${textClass} font-semibold`}>{request.projectTitle}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className={`${textClass} font-medium text-sm`}>{request.name}</p>
                          <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>{request.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {request.domain}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-primary font-semibold`}>
                        {request.currency === 'INR' ? '₹' : '$'}{request.budget?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className={`p-2 rounded-xl transition ${
                              isDark 
                                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                            }`}
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(request._id, 'completed')}
                            className={`p-2 rounded-xl transition ${
                              isDark 
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                                : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                            }`}
                            title="Mark as Completed"
                          >
                            <FiCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className={`p-2 rounded-xl transition ${
                              isDark 
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                            }`}
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-blue-600/20 flex items-center justify-center">
                <FiFileText className="text-primary" size={40} />
              </div>
              <h3 className={`${textClass} text-xl font-bold mb-2`}>No Project Requests</h3>
              <p className={isDark ? 'text-gray-400 mb-4' : 'text-gray-600 mb-4'}>
                {searchQuery || statusFilter !== 'all'
                  ? 'No project requests match your search criteria. Try adjusting your filters.'
                  : 'There are no project requests yet. Requests will appear here when customers submit "Build My Project" forms.'}
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              <p className={isDark ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${cardBg} border rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${textClass} text-2xl font-bold`}>Project Request Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`${textClass} font-semibold mb-2`}>Project Title</h4>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{selectedRequest.projectTitle}</p>
                  </div>
                  <div>
                    <h4 className={`${textClass} font-semibold mb-2`}>Description</h4>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{selectedRequest.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={`${textClass} font-semibold mb-2`}>Domain</h4>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{selectedRequest.domain}</p>
                    </div>
                    <div>
                      <h4 className={`${textClass} font-semibold mb-2`}>Budget</h4>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {selectedRequest.currency === 'INR' ? '₹' : '$'}{selectedRequest.budget?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                  {selectedRequest.techStack && selectedRequest.techStack.length > 0 && (
                    <div>
                      <h4 className={`${textClass} font-semibold mb-2`}>Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRequest.features && selectedRequest.features.length > 0 && (
                    <div>
                      <h4 className={`${textClass} font-semibold mb-2`}>Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedRequest.features.map((feature, index) => (
                          <li key={index} className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h4 className={`${textClass} font-semibold mb-2`}>Customer Information</h4>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {selectedRequest.name} ({selectedRequest.email})
                    </p>
                    {selectedRequest.phone && (
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Phone: {selectedRequest.phone}</p>
                    )}
                  </div>
                  {selectedRequest.aiAnalysis && (
                    <div>
                      <h4 className={`${textClass} font-semibold mb-2`}>AI Analysis</h4>
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(selectedRequest.aiAnalysis, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

