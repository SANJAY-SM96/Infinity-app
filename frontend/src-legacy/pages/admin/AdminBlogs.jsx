import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogService } from '../../api/blogService';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiZap,
  FiSearch,
  FiCalendar,
  FiTag,
  FiFileText
} from 'react-icons/fi';
import BlogGenerator from '../../components/admin/BlogGenerator';

export default function AdminBlogs() {
  const { isDark } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [page, search, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory })
      };
      const response = await blogService.getAllBlogs(params);
      // Ensure blogs have featured images - generate fallback if missing
      const blogsWithImages = (response.blogs || []).map(blog => ({
        ...blog,
        featuredImage: blog.featuredImage || generateFallbackImage(blog.title, blog.category)
      }));
      setBlogs(blogsWithImages);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to load blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await blogService.deleteBlog(id);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error(error);
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      await blogService.updateBlog(blog._id, {
        isPublished: !blog.isPublished,
        publishedAt: !blog.isPublished ? new Date() : null
      });
      toast.success(`Blog ${!blog.isPublished ? 'published' : 'unpublished'}`);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to update blog');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Draft';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate fallback image URL for blogs without featured images
  const generateFallbackImage = (title, category) => {
    const cleanTitle = (title || '').replace(/[^\w\s]/g, ' ').substring(0, 30).trim();
    const cleanCategory = (category || 'technology').toLowerCase().replace(/\s+/g, '-');
    const encodedSearch = encodeURIComponent(`${cleanCategory},${cleanTitle},technology,programming`);
    return `https://source.unsplash.com/1200x630/?${encodedSearch}`;
  };

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';

  return (
    <AdminLayout>
      <div className={`${bgClass} p-4 sm:p-6 lg:p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                <FiFileText className="text-blue-600" />
                Blog Management
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and create blog posts for SEO
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <FiZap /> AI Generate
              </button>
              <Link
                to="/admin/blogs/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <FiPlus /> New Blog
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 mb-6`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blogs..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">All Categories</option>
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
          </div>

          {/* Blog Generator Modal */}
          {showGenerator && (
            <BlogGenerator
              onClose={() => setShowGenerator(false)}
              onSuccess={() => {
                setShowGenerator(false);
                fetchBlogs();
              }}
            />
          )}

          {/* Blog List */}
          {loading ? (
            <Loader />
          ) : blogs.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-xl mb-4">No blogs found</p>
              <button
                onClick={() => setShowGenerator(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Generate Your First Blog
              </button>
            </div>
          ) : (
            <>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {blogs.map((blog) => (
                        <tr key={blog._id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}>
                          <td className="px-6 py-4">
                            <div>
                              <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {blog.title}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                                {blog.excerpt}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleTogglePublish(blog)}
                              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                                blog.isPublished
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {blog.isPublished ? <FiEye /> : <FiEyeOff />}
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {blog.views || 0}
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/blog/${blog.slug}`}
                                target="_blank"
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                                title="View"
                              >
                                <FiEye />
                              </Link>
                              <Link
                                to={`/admin/blogs/edit/${blog._id}`}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition"
                                title="Edit"
                              >
                                <FiEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(blog._id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  <span className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      page === totalPages
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

