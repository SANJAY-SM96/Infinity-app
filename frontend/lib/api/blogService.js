import api from './apiClient';

export const blogService = {
  // Get all published blogs
  getBlogs: async (params = {}) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  // Get single blog by slug
  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  // Get blog categories
  getCategories: async () => {
    const response = await api.get('/blogs/categories');
    return response.data;
  },

  // Get blog tags
  getTags: async () => {
    const response = await api.get('/blogs/tags');
    return response.data;
  },

  // Admin: Get all blogs
  getAllBlogs: async (params = {}) => {
    const response = await api.get('/blogs/admin/all', { params });
    return response.data;
  },

  // Admin: Create blog
  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  // Admin: Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  // Admin: Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // Admin: Generate blog using AI
  generateBlog: async (options) => {
    const response = await api.post('/blogs/generate', options);
    return response.data;
  }
};

