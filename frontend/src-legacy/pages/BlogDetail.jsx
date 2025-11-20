import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogService } from '../api/blogService';
import { useTheme } from '../context/ThemeContext';
import Loader from '../components/Loader';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiTag,
  FiArrowLeft,
  FiShare2,
  FiEye,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiLink
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';
import { BASE_URL, generateArticleSchema, generateOrganizationSchema, combineSchemas } from '../utils/seoConfig';

export default function BlogDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  // Check if blog has any image
  const hasImage = () => {
    if (!blog) return false;
    return !!(blog.featuredImage || blog.image || blog.thumbnail);
  };

  // Generate fallback image URL based on category/title
  const getFallbackImage = () => {
    if (!blog) return '';

    const category = blog.category || 'technology';
    const title = blog.title || 'blog';

    // Clean and encode search terms
    const cleanTitle = title.replace(/[^\w\s]/g, ' ').substring(0, 30).trim();
    const cleanCategory = category.toLowerCase().replace(/\s+/g, '-');
    const keywords = blog.keywords?.slice(0, 3).join(',') || '';

    const encodedSearch = encodeURIComponent(`${cleanCategory},${cleanTitle},${keywords},technology,programming`);

    // Using Unsplash Source API for dynamic placeholder images
    return `https://source.unsplash.com/1600x900/?${encodedSearch}`;
  };

  // Get hero image URL
  const getHeroImage = () => {
    if (blog?.featuredImage && !imageError) {
      return blog.featuredImage;
    }
    if (blog?.image && !imageError) {
      return blog.image;
    }
    if (blog?.thumbnail && !imageError) {
      return blog.thumbnail;
    }
    // Return fallback only if blog exists
    return blog ? getFallbackImage() : '';
  };

  // SEO hook
  useSEO({
    title: blog?.metaTitle || blog?.title ? `${blog.metaTitle || blog.title} | Infinity IT Blog` : undefined,
    description: blog?.metaDescription || blog?.excerpt,
    keywords: Array.isArray(blog?.keywords) ? blog.keywords.join(', ') : blog?.keywords || blog?.tags?.join(', '),
    image: getHeroImage(),
    url: blog ? `${BASE_URL}/blog/${blog.slug}` : undefined,
    type: 'article',
    structuredData: blog ? combineSchemas(
      generateArticleSchema(blog, BASE_URL),
      generateOrganizationSchema(BASE_URL)
    ) : null,
    breadcrumbs: blog ? [
      { name: 'Home', url: BASE_URL },
      { name: 'Blog', url: `${BASE_URL}/blog` },
      { name: blog.title, url: `${BASE_URL}/blog/${blog.slug}` }
    ] : null
  });

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setImageError(false);
      setHeroImageFailed(false);
      const response = await blogService.getBlogBySlug(slug);
      setBlog(response.blog);

      if (response.blog.category) {
        const relatedResponse = await blogService.getBlogs({
          category: response.blog.category,
          limit: 3
        });
        setRelatedBlogs(relatedResponse.blogs.filter(b => b.slug !== slug).slice(0, 3));
      }
    } catch (error) {
      toast.error('Failed to load blog post');
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
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

  const shareBlog = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    const text = blog.excerpt;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      setShowShareMenu(false);
    } else if (platform === 'native' && navigator.share) {
      navigator.share({
        title,
        text,
        url
      });
      setShowShareMenu(false);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton Hero Section */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 mb-8 animate-pulse" />

          {/* Skeleton Content */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden p-8`}>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 w-1/2 animate-pulse" />
            <div className="flex gap-4 mb-6">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Blog post not found
          </h2>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 transition"
          >
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  // Determine if we should show hero section
  // Show hero if blog exists and image hasn't completely failed
  const showHero = !!blog && !heroImageFailed;

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Hero Image Section - Only render if blog exists and image is available */}
      {showHero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full px-4 sm:px-6 lg:px-8 pt-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full aspect-video overflow-hidden rounded-xl">
              <img
                key={imageError ? 'fallback' : 'primary'}
                src={getHeroImage()}
                alt={blog.title}
                onError={() => {
                  // If we have an actual image and it fails, try fallback
                  if (hasImage() && !imageError) {
                    setImageError(true);
                  } else {
                    // If fallback also fails or no image exists, hide hero completely
                    setHeroImageFailed(true);
                  }
                }}
                onLoad={() => {
                  // Reset error states on successful load
                  setImageError(false);
                  setHeroImageFailed(false);
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Back Button Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Back</span>
                </Link>
              </div>

              {/* Category Badge Overlay */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {blog.category && (
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm shadow-lg ${isDark
                      ? 'bg-blue-600/90 text-white'
                      : 'bg-blue-600/90 text-white'
                    }`}>
                    {blog.category}
                  </span>
                )}
                {blog.isFeatured && (
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm shadow-lg ${isDark
                      ? 'bg-yellow-500/90 text-white'
                      : 'bg-yellow-500/90 text-white'
                    }`}>
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back Button - Show when no hero image */}
      {!showHero && (
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg mb-6"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${showHero ? 'pt-8' : 'pt-4'} relative z-10`}>
        {/* Article Card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden`}
        >
          {/* Title Section */}
          <div className="px-6 sm:px-8 lg:px-12 pt-8 pb-6">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className={`text-xl sm:text-2xl leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              {blog.excerpt}
            </p>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <FiUser className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {blog.authorName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <FiCalendar className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDate(blog.publishedAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <FiClock className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {blog.readingTime || 5} min read
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <FiEye className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {blog.views || 0} views
                </span>
              </div>

              {/* Share Button */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } shadow-md hover:shadow-lg`}
                >
                  <FiShare2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Share Menu Dropdown */}
                {showShareMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-20 ${isDark ? 'bg-gray-700' : 'bg-white'
                    } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="py-2">
                      {navigator.share && (
                        <button
                          onClick={() => shareBlog('native')}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <FiShare2 className="w-4 h-4" />
                            Share via...
                          </div>
                        </button>
                      )}
                      <button
                        onClick={() => shareBlog('twitter')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <FiTwitter className="w-4 h-4" />
                          Twitter
                        </div>
                      </button>
                      <button
                        onClick={() => shareBlog('facebook')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <FiFacebook className="w-4 h-4" />
                          Facebook
                        </div>
                      </button>
                      <button
                        onClick={() => shareBlog('linkedin')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <FiLinkedin className="w-4 h-4" />
                          LinkedIn
                        </div>
                      </button>
                      <button
                        onClick={() => shareBlog('copy')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <FiLink className="w-4 h-4" />
                          Copy Link
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {blog.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${isDark
                        ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <FiTag className="w-3.5 h-3.5" />
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="px-6 sm:px-8 lg:px-12 pb-12">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.article>

        {/* Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 mb-12"
          >
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map(relatedBlog => (
                <Link
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog.slug}`}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${isDark ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                  {relatedBlog.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                      {relatedBlog.title}
                    </h3>
                    <p className={`text-sm line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {relatedBlog.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                      <FiClock className="w-3 h-3" />
                      <span>{relatedBlog.readingTime || 5} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Share Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
        >
          <FiShare2 className="w-6 h-6" />
        </button>
        {showShareMenu && (
          <div className={`absolute bottom-16 right-0 w-48 rounded-lg shadow-xl ${isDark ? 'bg-gray-700' : 'bg-white'
            } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="py-2">
              {navigator.share && (
                <button
                  onClick={() => shareBlog('native')}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                  Share via...
                </button>
              )}
              <button
                onClick={() => shareBlog('twitter')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                Twitter
              </button>
              <button
                onClick={() => shareBlog('copy')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
