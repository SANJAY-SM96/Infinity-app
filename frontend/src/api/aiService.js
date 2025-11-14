import api from './apiClient';

export const aiService = {
  checkAvailability: () => api.get('/ai/availability'),
  analyzeRequirements: (data) => api.post('/ai/analyze', data),
  getSuggestions: (query) => api.get('/ai/suggestions', { params: { query } }),
  chatbot: (message, conversationHistory = []) => api.post('/ai/chatbot', { message, conversationHistory })
};

