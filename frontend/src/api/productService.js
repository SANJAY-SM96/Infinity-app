import api from './apiClient';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: (params) => api.get('/products/trending', { params }),
  getTopSelling: (params) => api.get('/products/top-selling', { params }),
  getNewUploads: (params) => api.get('/products/new-uploads', { params }),
  getWebBased: (params) => api.get('/products/web-based', { params }),
  create: (data) => api.post('/products', data),
  createWithFile: (formData) => api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, data) => api.put(`/products/${id}`, data),
  updateWithFile: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  delete: (id) => api.delete(`/products/${id}`),
  toggleFeatured: (id) => api.patch(`/products/${id}/featured`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data)
};
