import api from './apiClient';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await api.get('/auth/profile');
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return { ...response, data: { ...response.data, token } };
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  changePassword: async (passwordData) => {
    return await api.post('/auth/change-password', passwordData);
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgotpassword', { email });
  },

  resetPassword: async (token, password) => {
    return await api.put(`/auth/resetpassword/${token}`, { password });
  },

  verifyOTP: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  resendOTP: async (email) => {
    return await api.post('/auth/resend-otp', { email });
  }
};

export default authService;