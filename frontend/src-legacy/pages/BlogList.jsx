import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogService } from '../api/blogService';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { generateBlogImageAlt } from '../utils/imageOptimizer';
import Loader from '../components/Loader';
import { FiCalendar, FiClock, FiUser, FiTag, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BlogList() {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, [page, search, selectedCategory, selectedTag]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedTag && { tag: selectedTag })
      };
      const response = await blogService.getBlogs(params);
      setBlogs(response.blogs);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast.error('Failed to load blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogService.getTags();
      setTags(response.tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ 
      ...(search && { search }),
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedTag && { tag: selectedTag })
    });
    fetchBlogs();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedTag('');
    setPage(1);
    setSearchParams({});
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
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

  // SEO metadata
  const seoData = useMemo(() => {
    const baseUrl = 'https://infinitywebtechnology.com';
    const currentUrl = `${baseUrl}/blog${search || selectedCategory || selectedTag ? '?' : ''}${search ? `search=${search}` : ''}${selectedCategory ? `category=${selectedCategory}` : ''}${selectedTag ? `tag=${selectedTag}` : ''}`;
    const pageTitle = selectedCategory 
      ? `${selectedCategory} Articles | IT Project Blog | Infinity`
      : search
      ? `Search: ${search} | IT Project Blog | Infinity`
      : 'IT Project Blog | Technology Articles & Tutorials | Infinity Marketplace';
    const pageDescription = selectedCategory
      ? `Read ${selectedCategory} articles about IT projects, technology tutorials, and development tips. Stay updated with latest trends in React, Python, AI/ML, and Full-Stack development.`
      : search
      ? `Search results for "${search}" - Find articles about IT projects, technology tutorials, and development tips.`
      : 'Read articles about IT projects, technology tutorials, React, Python, AI/ML, Full-Stack development, and more. Stay updated with latest trends and best practices.';

    const breadcrumbs = [
      { name: 'Home', url: baseUrl },
      { name: 'Blog', url: `${baseUrl}/blog` }
    ];
    if (selectedCategory) {
      breadcrumbs.push({ name: selectedCategory, url: currentUrl });
    }

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: 'IT project blog, technology articles, React tutorials, Python guides, AI ML articles, Full-Stack development, programming tutorials, web development blog',
      image: 'https://infinitywebtechnology.com/og-image.jpg',
      url: currentUrl,
      type: 'website',
      breadcrumbs,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Infinity IT Project Blog',
        description: pageDescription,
        url: `${baseUrl}/blog`,
        publisher: {
          '@type': 'Organization',
          name: 'Infinity Web Technology',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        }
      }
    };
  }, [search, selectedCategory, selectedTag]);

  useSEO(seoData);

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';

  return (
    <main className={`min-h-screen ${bgClass} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Blog & Articles
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover insights, tutorials, and updates about IT projects and technology
            </p>
          </motion.div>
        </header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blogs..."
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <FiFilter className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Filters:</span>
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">All Tags</option>
                {tags.slice(0, 20).map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              {(search || selectedCategory || selectedTag) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <FiX /> Clear Filters
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Blog Grid */}
        <section aria-label="Blog articles listing">
        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-xl">No blogs found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <div className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col`}>
                      <div className="h-48 overflow-hidden relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800">
                        {blog.featuredImage ? (
                          <img 
                            src={blog.featuredImage} 
                            alt={generateBlogImageAlt(blog.title, blog.category)}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            width="400"
                            height="240"
                            decoding="async"
                            aria-label={`${blog.title} featured image`}
                            onError={(e) => {
                              // Fallback to generated image if original fails
                              const fallbackImage = generateFallbackImage(blog.title, blog.category);
                              if (e.target.src !== fallbackImage) {
                                e.target.src = fallbackImage;
                              }
                            }}
                          />
                        ) : (
                          <img 
                            src={generateFallbackImage(blog.title, blog.category)}
                            alt={generateBlogImageAlt(blog.title, blog.category)}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            width="400"
                            height="240"
                            decoding="async"
                          />
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {blog.category}
                          </span>
                          {blog.isFeatured && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              Featured
                            </span>
                          )}
                        </div>
                        <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                          {blog.title}
                        </h2>
                        <p className={`text-sm mb-4 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <FiUser /> {blog.authorName}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar /> {formatDate(blog.publishedAt)}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <FiClock /> {blog.readingTime} min
                          </span>
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {blog.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <FiTag /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
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
        </section>
      </div>
    </main>
  );
}

