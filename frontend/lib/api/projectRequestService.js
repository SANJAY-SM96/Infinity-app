import api from './apiClient';

export const projectRequestService = {
  create: (data) => api.post('/project-requests', data),
  createRequest: (data) => api.post('/project-requests', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/project-requests', { params }),
  getById: (id) => api.get(`/project-requests/${id}`),
  update: (id, data) => api.put(`/project-requests/${id}`, data),
  delete: (id) => api.delete(`/project-requests/${id}`),
  getUserRequests: () => api.get('/project-requests/user'),
  getMyRequests: () => api.get('/project-requests/user')
};

