import api from './apiClient';

export const seoContentService = {
  getAll: (params) => api.get('/seo-content', { params }),
  getByPath: (path) => api.get(`/seo-content/path/${path}`),
  create: (data) => api.post('/seo-content', data),
  update: (id, data) => api.put(`/seo-content/${id}`, data),
  delete: (id) => api.delete(`/seo-content/${id}`),
  generate: (data) => api.post('/seo-content/generate', data),
  bulkUpdate: (updates) => api.post('/seo-content/bulk-update', { updates }),
  getAnalytics: () => api.get('/seo-content/analytics')
};

