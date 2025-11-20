import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { seoContentService } from '../../api/seoContentService';
import { useTheme } from '../../context/ThemeContext';
import { FiSearch, FiFileText, FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiZap, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSEOContent() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    pageType: 'home',
    pagePath: '',
    pageTitle: '',
    metaDescription: '',
    metaKeywords: [],
    h1: '',
    h2: [],
    content: '',
    robots: 'index, follow',
    sitemapPriority: 0.5,
    sitemapChangeFreq: 'weekly'
  });
  const [generating, setGenerating] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await seoContentService.getAll();
      setContents(response.data.contents || []);
    } catch (error) {
      console.error('Failed to fetch SEO content:', error);
      toast.error('Failed to load SEO content');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await seoContentService.create(formData);
      toast.success('SEO content created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchContents();
    } catch (error) {
      console.error('Failed to create SEO content:', error);
      toast.error(error.response?.data?.message || 'Failed to create SEO content');
    }
  };

  const handleUpdate = async () => {
    if (!selectedContent) return;

    try {
      await seoContentService.update(selectedContent._id, formData);
      toast.success('SEO content updated successfully');
      setShowEditModal(false);
      setSelectedContent(null);
      resetForm();
      fetchContents();
    } catch (error) {
      console.error('Failed to update SEO content:', error);
      toast.error(error.response?.data?.message || 'Failed to update SEO content');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this SEO content?')) {
      return;
    }

    try {
      await seoContentService.delete(id);
      toast.success('SEO content deleted successfully');
      fetchContents();
    } catch (error) {
      console.error('Failed to delete SEO content:', error);
      toast.error(error.response?.data?.message || 'Failed to delete SEO content');
    }
  };

  const handleGenerate = async () => {
    if (!formData.pageTitle || !formData.content) {
      toast.error('Please provide page title and content');
      return;
    }

    try {
      setGenerating(true);
      const response = await seoContentService.generate({
        pageType: formData.pageType,
        pagePath: formData.pagePath,
        pageTitle: formData.pageTitle,
        content: formData.content,
        keywords: formData.metaKeywords
      });

      const generated = response.data.generatedContent;
      setFormData({
        ...formData,
        pageTitle: generated.pageTitle,
        metaDescription: generated.metaDescription,
        metaKeywords: generated.metaKeywords || []
      });
      toast.success('SEO content generated successfully');
    } catch (error) {
      console.error('Failed to generate SEO content:', error);
      toast.error(error.response?.data?.message || 'Failed to generate SEO content');
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pageType: 'home',
      pagePath: '',
      pageTitle: '',
      metaDescription: '',
      metaKeywords: [],
      h1: '',
      h2: [],
      content: '',
      robots: 'index, follow',
      sitemapPriority: 0.5,
      sitemapChangeFreq: 'weekly'
    });
  };

  const openEditModal = (content) => {
    setSelectedContent(content);
    setFormData({
      pageType: content.pageType,
      pagePath: content.pagePath,
      pageTitle: content.pageTitle,
      metaDescription: content.metaDescription,
      metaKeywords: content.metaKeywords || [],
      h1: content.h1 || '',
      h2: content.h2 || [],
      content: content.content,
      robots: content.robots || 'index, follow',
      sitemapPriority: content.sitemapPriority || 0.5,
      sitemapChangeFreq: content.sitemapChangeFreq || 'weekly'
    });
    setShowEditModal(true);
  };

  const filteredContents = contents.filter(content =>
    content.pagePath?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.pageTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SEO Content Management
              </span>
            </h1>
            <p className={`text-sm sm:text-base ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              Manage SEO content for all pages on your site
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition"
          >
            <FiPlus className="inline mr-2" />
            Create New
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
          <input
            type="text"
            placeholder="Search SEO content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
              isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Content List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((content, index) => (
            <motion.div
              key={content._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} border rounded-xl p-4 hover:border-primary/40 transition`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
                    {content.pageTitle}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    {content.pagePath}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                    content.pageType === 'home' ? 'bg-blue-500/20 text-blue-500' :
                    content.pageType === 'product' ? 'bg-green-500/20 text-green-500' :
                    content.pageType === 'blog' ? 'bg-purple-500/20 text-purple-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {content.pageType}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditModal(content)}
                  className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition text-xs font-medium"
                >
                  <FiEdit className="inline mr-1" size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(content._id)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-xs font-medium"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContents.length === 0 && (
          <div className="py-12 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No SEO content found</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(showCreateModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedContent(null);
                resetForm();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                    {showCreateModal ? 'Create SEO Content' : 'Edit SEO Content'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-500 rounded-lg hover:bg-purple-500/30 transition text-sm font-medium disabled:opacity-50"
                    >
                      <FiZap className="inline mr-1" size={14} />
                      {generating ? 'Generating...' : 'AI Generate'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedContent(null);
                        resetForm();
                      }}
                      className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Page Type
                      </label>
                      <select
                        value={formData.pageType}
                        onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                          isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="home">Home</option>
                        <option value="product">Product</option>
                        <option value="blog">Blog</option>
                        <option value="category">Category</option>
                        <option value="about">About</option>
                        <option value="contact">Contact</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Page Path *
                      </label>
                      <input
                        type="text"
                        value={formData.pagePath}
                        onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
                        placeholder="/home"
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                          isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Page Title *
                    </label>
                    <input
                      type="text"
                      value={formData.pageTitle}
                      onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Meta Description *
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      rows={3}
                      maxLength={160}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Meta Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(formData.metaKeywords) ? formData.metaKeywords.join(', ') : formData.metaKeywords}
                      onChange={(e) => {
                        const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                        setFormData({ ...formData, metaKeywords: keywords });
                      }}
                      placeholder="keyword1, keyword2, keyword3"
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={8}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${
                        isDark ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={showCreateModal ? handleCreate : handleUpdate}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                    >
                      <FiSave className="inline mr-2" />
                      {showCreateModal ? 'Create' : 'Update'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedContent(null);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-500 rounded-lg hover:bg-gray-500/30 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

