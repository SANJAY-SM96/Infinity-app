import api from './apiClient';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getSalesChart: (params) => api.get('/admin/dashboard/sales-chart', { params }),
  getOrderStats: () => api.get('/admin/dashboard/order-stats'),
  getTopProducts: () => api.get('/admin/dashboard/top-products'),
  getLowStockProducts: () => api.get('/admin/dashboard/low-stock'),
  getCategoryStats: () => api.get('/admin/dashboard/category-stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data)
};
