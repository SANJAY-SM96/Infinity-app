import api from './apiClient';

export const aiService = {
  checkAvailability: () => api.get('/ai/availability'),
  analyzeRequirements: (data) => api.post('/ai/analyze', data),
  getSuggestions: (query) => api.get('/ai/suggestions', { params: { query } }),
  chatbot: (message, conversationHistory = []) => api.post('/ai/chatbot', { message, conversationHistory }),
  getProjectIdeas: (data) => api.post('/ai/project-ideas', data),
  recommendProjects: (data) => api.post('/ai/recommend-projects', data),
  explainFunctionality: (data) => api.post('/ai/explain-functionality', data)
};

