import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { projectRequestService } from '../../api/projectRequestService';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiEdit, FiTrash2, FiSearch, FiFilter, FiX, FiEye, FiCheck, FiXCircle, FiFileText,
  FiClock, FiDollarSign, FiTrendingUp, FiAlertCircle, FiMoreVertical, FiMail, FiPhone
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProjectRequests() {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]); // Store all requests for stats
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const { isDark } = useTheme();

  const statuses = ['all', 'pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'];
  const itemsPerPage = 10;

  // Calculate statistics from all requests
  const stats = useMemo(() => {
    if (!allRequests.length) return null;
    
    const total = allRequests.length;
    const pending = allRequests.filter(r => r.status === 'pending').length;
    const completed = allRequests.filter(r => r.status === 'completed').length;
    const totalBudget = allRequests.reduce((sum, r) => sum + (parseFloat(r.budget) || 0), 0);
    const avgBudget = total > 0 ? totalBudget / total : 0;
    
    // Get unique domains
    const domains = [...new Set(allRequests.map(r => r.domain).filter(Boolean))];
    
    return { total, pending, completed, totalBudget, avgBudget, domains };
  }, [allRequests]);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter, searchQuery, domainFilter]);

  // Close status menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showStatusMenu && !e.target.closest('.relative')) {
        setShowStatusMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStatusMenu]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        domain: domainFilter !== 'all' ? domainFilter : undefined
      };
      const response = await projectRequestService.getAll(params);
      
      // Handle both 'projectRequests' and 'requests' response format
      // Backend returns 'requests', but we support both for compatibility
      const fetchedRequests = response.data.requests || response.data.projectRequests || [];
      
      // Fetch all requests for statistics (without pagination)
      try {
        const allResponse = await projectRequestService.getAll({ limit: 1000 });
        setAllRequests(allResponse.data.requests || allResponse.data.projectRequests || []);
      } catch (err) {
        // Fallback to fetched requests if error
        setAllRequests(fetchedRequests);
      }
      
      setRequests(fetchedRequests);
      setTotalPages(response.data.pagination?.pages || 1);
      
      // Show helpful message if no requests found (handled in UI)
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

  const handleUpdateStatus = async (id, status, showSuccess = true) => {
    try {
      await projectRequestService.update(id, { status });
      if (showSuccess) toast.success(`Status updated to ${status}`);
      setShowStatusMenu(null);
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
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 ${textClass} break-words`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Request Manager
              </span>
            </h1>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View, filter, update, and manage all incoming project requests
            </p>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20`}>
                  <FiFileText className="text-blue-500" size={20} />
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium mb-1`}>Total Requests</p>
              <p className={`${textClass} text-xl sm:text-2xl md:text-3xl font-extrabold`}>{stats.total}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-yellow-500/10 border border-yellow-500/20`}>
                  <FiClock className="text-yellow-500" size={20} />
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium mb-1`}>Pending</p>
              <p className={`${textClass} text-xl sm:text-2xl md:text-3xl font-extrabold`}>{stats.pending}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-500/10 border border-green-500/20`}>
                  <FiCheck className="text-green-500" size={20} />
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium mb-1`}>Completed</p>
              <p className={`${textClass} text-xl sm:text-2xl md:text-3xl font-extrabold`}>{stats.completed}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20`}>
                  <FiDollarSign className="text-purple-500" size={20} />
                </div>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium mb-1`}>Avg Budget</p>
              <p className={`${textClass} text-xl sm:text-2xl md:text-3xl font-extrabold truncate`}>₹{stats.avgBudget.toFixed(0)}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative min-w-0">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full ${inputBg} pl-10 pr-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                aria-label="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px] sm:min-w-[160px]">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full ${inputBg} pl-10 pr-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer text-sm sm:text-base`}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          {stats && stats.domains.length > 0 && (
            <div className="relative min-w-[140px] sm:min-w-[160px]">
              <select
                value={domainFilter}
                onChange={(e) => {
                  setDomainFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full ${inputBg} pl-4 pr-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer text-sm sm:text-base`}
              >
                <option value="all">All Domains</option>
                {stats.domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          )}
        </motion.div>

        {/* Requests - Desktop Table / Mobile Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden`}
        >
          {requests.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
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
                            <p className={isDark ? 'text-gray-500' : 'text-gray-500 text-xs'}>{request.email}</p>
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
                          <div className="flex items-center justify-end gap-2 relative">
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
                            <div className="relative">
                              <button
                                onClick={() => setShowStatusMenu(showStatusMenu === request._id ? null : request._id)}
                                className={`p-2 rounded-xl transition ${
                                  isDark 
                                    ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' 
                                    : 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
                                }`}
                                title="Change Status"
                              >
                                <FiMoreVertical size={16} />
                              </button>
                              {showStatusMenu === request._id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`absolute right-0 top-full mt-2 w-48 ${cardBg} border rounded-xl shadow-2xl z-50 overflow-hidden`}
                                >
                                  {statuses.filter(s => s !== 'all').map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleUpdateStatus(request._id, status)}
                                      className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition ${textClass} ${
                                        request.status === status ? 'bg-primary/20 font-semibold' : ''
                                      }`}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </div>
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

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {requests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-xl p-4 space-y-3`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${textClass} font-bold text-base mb-1 truncate`}>{request.projectTitle}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {request.domain}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowStatusMenu(showStatusMenu === request._id ? null : request._id)}
                          className={`p-2 rounded-lg transition ${
                            isDark 
                              ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' 
                              : 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
                          }`}
                        >
                          <FiMoreVertical size={18} />
                        </button>
                        {showStatusMenu === request._id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`absolute right-0 top-full mt-2 w-48 ${cardBg} border rounded-xl shadow-2xl z-50 overflow-hidden`}
                          >
                            {statuses.filter(s => s !== 'all').map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateStatus(request._id, status)}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 transition ${textClass} ${
                                  request.status === status ? 'bg-primary/20 font-semibold' : ''
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className={`${isDark ? 'bg-gray-700/30' : 'bg-white'} rounded-lg p-3 space-y-1`}>
                      <p className={`${textClass} font-medium text-sm`}>{request.name}</p>
                      <a 
                        href={`mailto:${request.email}`}
                        className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline flex items-center gap-1`}
                      >
                        <FiMail size={12} />
                        {request.email}
                      </a>
                      {request.phone && (
                        <a 
                          href={`tel:${request.phone}`}
                          className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} hover:underline flex items-center gap-1`}
                        >
                          <FiPhone size={12} />
                          {request.phone}
                        </a>
                      )}
                    </div>

                    {/* Budget and Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Budget</p>
                        <p className={`text-primary font-bold text-lg`}>
                          {request.currency === 'INR' ? '₹' : '$'}{request.budget?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Date</p>
                        <p className={`${textClass} text-sm font-medium`}>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-700/30">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition ${
                          isDark 
                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20' 
                            : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-500/20'
                        }`}
                      >
                        <FiEye size={16} />
                        <span className="text-sm font-medium">View Details</span>
                      </button>
                      <button
                        onClick={() => handleDelete(request._id)}
                        className={`px-4 py-2.5 rounded-lg transition ${
                          isDark 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                            : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20'
                        }`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 sm:py-12 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-blue-600/20 flex items-center justify-center">
                <FiFileText className="text-primary" size={32} />
              </div>
              <h3 className={`${textClass} text-lg sm:text-xl font-bold mb-2`}>No Project Requests</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base mb-4 px-4`}>
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
                  className="px-4 py-2.5 bg-primary text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition text-sm sm:text-base font-medium"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-sm transition ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-sm transition ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
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
              onClick={() => {
                setShowDetailsModal(false);
                setShowStatusMenu(null);
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                    <h4 className={`${textClass} font-semibold mb-3 flex items-center gap-2`}>Customer Information</h4>
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} space-y-2`}>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-semibold">{selectedRequest.name}</span>
                      </p>
                      <a 
                        href={`mailto:${selectedRequest.email}`}
                        className={`flex items-center gap-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition`}
                      >
                        <FiMail size={16} />
                        {selectedRequest.email}
                      </a>
                      {selectedRequest.phone && (
                        <a 
                          href={`tel:${selectedRequest.phone}`}
                          className={`flex items-center gap-2 ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition`}
                        >
                          <FiPhone size={16} />
                          {selectedRequest.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className={`${textClass} font-semibold mb-3`}>Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statuses.filter(s => s !== 'all').map((status) => (
                        <motion.button
                          key={status}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            handleUpdateStatus(selectedRequest._id, status);
                            setSelectedRequest({ ...selectedRequest, status });
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                            selectedRequest.status === status
                              ? getStatusColor(status)
                              : isDark
                              ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </motion.button>
                      ))}
                    </div>
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

