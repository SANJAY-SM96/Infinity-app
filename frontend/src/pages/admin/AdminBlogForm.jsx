import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogService } from '../../api/blogService';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { 
  FiSave, 
  FiX, 
  FiImage,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'React Projects',
    tags: '',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    isPublished: false,
    isFeatured: false
  });

  useEffect(() => {
    if (isEditMode) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setFetching(true);
      // Get all blogs and find the one with matching ID
      const response = await blogService.getAllBlogs({ limit: 1000 });
      const blog = response.blogs?.find(b => b._id === id);
      
      if (!blog) {
        toast.error('Blog not found');
        navigate('/admin/blogs');
        return;
      }

      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || 'React Projects',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
        featuredImage: blog.featuredImage || '',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        keywords: Array.isArray(blog.keywords) ? blog.keywords.join(', ') : (blog.keywords || ''),
        isPublished: blog.isPublished || false,
        isFeatured: blog.isFeatured || false
      });
    } catch (error) {
      toast.error('Failed to load blog');
      console.error(error);
      navigate('/admin/blogs');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
      };

      if (isEditMode) {
        await blogService.updateBlog(id, blogData);
        toast.success('Blog updated successfully');
      } else {
        await blogService.createBlog(blogData);
        toast.success('Blog created successfully');
      }
      
      navigate('/admin/blogs');
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} blog`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateImageUrl = () => {
    const title = formData.title || 'blog';
    const category = formData.category || 'technology';
    const cleanTitle = title.replace(/[^\w\s]/g, ' ').substring(0, 30).trim();
    const cleanCategory = category.toLowerCase().replace(/\s+/g, '-');
    const encodedSearch = encodeURIComponent(`${cleanCategory},${cleanTitle},technology,programming`);
    return `https://source.unsplash.com/1200x630/?${encodedSearch}`;
  };

  if (fetching) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  const bgClass = isDark 
    ? 'bg-gray-800' 
    : 'bg-white';
  const inputClass = isDark 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <AdminLayout>
      <div className={`${bgClass} min-h-screen p-4 sm:p-6 lg:p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isEditMode ? 'Edit Blog' : 'Create New Blog'}
            </h1>
            <button
              onClick={() => navigate('/admin/blogs')}
              className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                maxLength={300}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.excerpt.length}/300 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Content * (HTML supported)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className={`w-full px-4 py-3 rounded-lg border font-mono text-sm ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            {/* Category & Featured Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="React Projects">React Projects</option>
                  <option value="Python Projects">Python Projects</option>
                  <option value="AI/ML Projects">AI/ML Projects</option>
                  <option value="Full-Stack Projects">Full-Stack Projects</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Tutorials">Tutorials</option>
                  <option value="Industry News">Industry News</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Featured Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="Image URL or leave empty for auto-generated"
                    className={`flex-1 px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featuredImage: generateImageUrl() })}
                    className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'} transition`}
                    title="Generate image"
                  >
                    <FiImage />
                  </button>
                </div>
                {formData.featuredImage && (
                  <img 
                    src={formData.featuredImage} 
                    alt="Preview" 
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = generateImageUrl();
                    }}
                  />
                )}
              </div>
            </div>

            {/* Tags & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, JavaScript, Tutorial"
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="react hooks, useState, useEffect"
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            {/* SEO Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            {/* Publish & Featured */}
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-2">
                  {formData.isPublished ? <FiEye /> : <FiEyeOff />}
                  Published
                </span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Featured
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/blogs')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    {isEditMode ? 'Update Blog' : 'Create Blog'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

