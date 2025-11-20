import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFileText, 
  FiTag, 
  FiKey, 
  FiBook, 
  FiBarChart2,
  FiCode,
  FiCopy,
  FiCheck,
  FiZap,
  FiAlertCircle
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { seoAIService } from '../../api/seoAIService';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

export default function AdminSEOTools() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('meta');
  const [copied, setCopied] = useState('');

  // Meta Description
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState('');

  // Page Title
  const [pageTitle, setPageTitle] = useState('');
  const [pageCategory, setPageCategory] = useState('');
  const [pageKeywords, setPageKeywords] = useState('');
  const [generatedPageTitle, setGeneratedPageTitle] = useState('');

  // Product Description
  const [prodTitle, setProdTitle] = useState('');
  const [prodTechStack, setProdTechStack] = useState('');
  const [prodFeatures, setProdFeatures] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [generatedProdDesc, setGeneratedProdDesc] = useState(null);

  // Keywords
  const [keywordTitle, setKeywordTitle] = useState('');
  const [keywordCategory, setKeywordCategory] = useState('');
  const [keywordTechStack, setKeywordTechStack] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState(null);

  // Blog Posts
  const [blogCategory, setBlogCategory] = useState('');
  const [blogTechStack, setBlogTechStack] = useState('');
  const [generatedBlogPosts, setGeneratedBlogPosts] = useState(null);

  // Content Analysis
  const [analysisContent, setAnalysisContent] = useState('');
  const [analysisKeywords, setAnalysisKeywords] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    try {
      const result = await seoAIService.checkAvailability();
      setAiAvailable(result.available);
      if (!result.available) {
        toast.error('AI service not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to backend .env');
      }
    } catch (error) {
      console.error('Failed to check AI availability:', error);
      setAiAvailable(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(''), 2000);
  };

  const generateMetaDescription = async () => {
    if (!metaTitle || !metaDesc) {
      toast.error('Please provide product title and description');
      return;
    }

    setLoading(true);
    try {
      const result = await seoAIService.generateMetaDescription(
        metaTitle,
        metaDesc,
        metaKeywords.split(',').map(k => k.trim()).filter(k => k)
      );
      setGeneratedMeta(result.metaDescription);
      toast.success('Meta description generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate meta description');
    } finally {
      setLoading(false);
    }
  };

  const generatePageTitle = async () => {
    if (!pageTitle || !pageCategory) {
      toast.error('Please provide product title and category');
      return;
    }

    setLoading(true);
    try {
      const result = await seoAIService.generatePageTitle(
        pageTitle,
        pageCategory,
        pageKeywords.split(',').map(k => k.trim()).filter(k => k)
      );
      setGeneratedPageTitle(result.pageTitle);
      toast.success('Page title generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate page title');
    } finally {
      setLoading(false);
    }
  };

  const generateProductDescription = async () => {
    if (!prodTitle || !prodCategory) {
      toast.error('Please provide product title and category');
      return;
    }

    setLoading(true);
    try {
      const result = await seoAIService.generateProductDescription(
        prodTitle,
        prodTechStack.split(',').map(t => t.trim()).filter(t => t),
        prodFeatures.split(',').map(f => f.trim()).filter(f => f),
        prodCategory
      );
      setGeneratedProdDesc(result);
      toast.success('Product description generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate product description');
    } finally {
      setLoading(false);
    }
  };

  const generateKeywords = async () => {
    if (!keywordTitle || !keywordCategory) {
      toast.error('Please provide product title and category');
      return;
    }

    setLoading(true);
    try {
      const result = await seoAIService.generateKeywordSuggestions(
        keywordTitle,
        keywordCategory,
        keywordTechStack.split(',').map(t => t.trim()).filter(t => t)
      );
      setGeneratedKeywords(result.keywords);
      toast.success('Keywords generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate keywords');
    } finally {
      setLoading(false);
    }
  };

  const generateBlogPosts = async () => {
    if (!blogCategory) {
      toast.error('Please provide category');
      return;
    }

    setLoading(true);
    try {
      const result = await seoAIService.generateBlogPostIdeas(
        blogCategory,
        blogTechStack.split(',').map(t => t.trim()).filter(t => t)
      );
      setGeneratedBlogPosts(result.blogPosts || []);
      toast.success('Blog post ideas generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate blog posts');
    } finally {
      setLoading(false);
    }
  };

  const analyzeContent = async () => {
    if (!analysisContent) {
      toast.error('Please provide content to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await seoAIService.analyzeContentSEO(
        analysisContent,
        analysisKeywords.split(',').map(k => k.trim()).filter(k => k)
      );
      setAnalysisResult(result.analysis);
      toast.success('Content analyzed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const inputClass = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  const tabs = [
    { id: 'meta', label: 'Meta Description', icon: FiFileText },
    { id: 'title', label: 'Page Title', icon: FiTag },
    { id: 'description', label: 'Product Description', icon: FiFileText },
    { id: 'keywords', label: 'Keywords', icon: FiKey },
    { id: 'blog', label: 'Blog Ideas', icon: FiBook },
    { id: 'analyze', label: 'Content Analysis', icon: FiBarChart2 }
  ];

  return (
    <AdminLayout>
      <div className={`${bgClass} ${textClass} p-4 sm:p-6 lg:p-8`}>
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600`}>
              <FiZap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">AI SEO Tools</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate SEO-optimized content to rank higher in Google search
              </p>
            </div>
          </div>

          {!aiAvailable && (
            <div className={`${cardBg} border rounded-xl p-4 flex items-center gap-3 mb-4`}>
              <FiAlertCircle className="text-yellow-500 w-5 h-5" />
              <div>
                <p className="font-semibold text-yellow-500">AI Service Not Configured</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add GEMINI_API_KEY or OPENAI_API_KEY to backend .env file
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className={`${cardBg} border rounded-xl p-2 mb-6 flex flex-wrap gap-2`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className={`${cardBg} border rounded-xl p-4 sm:p-6 lg:p-8`}>
          {loading && <Loader />}

          {/* Meta Description Tab */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Generate Meta Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Title *</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="e.g., E-Commerce Website with React"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Description *</label>
                  <textarea
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="Enter product description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="React, E-commerce, MERN stack"
                  />
                </div>
                <button
                  onClick={generateMetaDescription}
                  disabled={loading || !aiAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Generate Meta Description
                </button>
                {generatedMeta && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mt-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Generated Meta Description ({generatedMeta.length} chars)</label>
                      <button
                        onClick={() => copyToClipboard(generatedMeta, 'meta')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {copied === 'meta' ? <FiCheck className="text-green-500" /> : <FiCopy />}
                      </button>
                    </div>
                    <p className={textClass}>{generatedMeta}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Title Tab */}
          {activeTab === 'title' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Generate SEO Page Title</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Title *</label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="e.g., E-Commerce Website"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={pageCategory}
                    onChange={(e) => setPageCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="e.g., React Projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={pageKeywords}
                    onChange={(e) => setPageKeywords(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="React, E-commerce, MERN"
                  />
                </div>
                <button
                  onClick={generatePageTitle}
                  disabled={loading || !aiAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Generate Page Title
                </button>
                {generatedPageTitle && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mt-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Generated Title ({generatedPageTitle.length} chars)</label>
                      <button
                        onClick={() => copyToClipboard(generatedPageTitle, 'title')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {copied === 'title' ? <FiCheck className="text-green-500" /> : <FiCopy />}
                      </button>
                    </div>
                    <p className={textClass}>{generatedPageTitle}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Generate SEO Product Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Title *</label>
                  <input
                    type="text"
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={prodTechStack}
                    onChange={(e) => setProdTechStack(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={prodFeatures}
                    onChange={(e) => setProdFeatures(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="User authentication, Payment gateway, Admin panel"
                  />
                </div>
                <button
                  onClick={generateProductDescription}
                  disabled={loading || !aiAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Generate Description
                </button>
                {generatedProdDesc && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mt-4 space-y-4`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold">Description</label>
                        <button
                          onClick={() => copyToClipboard(generatedProdDesc.description, 'desc')}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          {copied === 'desc' ? <FiCheck className="text-green-500" /> : <FiCopy />}
                        </button>
                      </div>
                      <p className={textClass}>{generatedProdDesc.description}</p>
                    </div>
                    {generatedProdDesc.keywords && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Suggested Keywords</label>
                        <div className="flex flex-wrap gap-2">
                          {generatedProdDesc.keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {generatedProdDesc.seoTips && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">SEO Tips</label>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {generatedProdDesc.seoTips}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Generate Keyword Suggestions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Title *</label>
                  <input
                    type="text"
                    value={keywordTitle}
                    onChange={(e) => setKeywordTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={keywordCategory}
                    onChange={(e) => setKeywordCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={keywordTechStack}
                    onChange={(e) => setKeywordTechStack(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  />
                </div>
                <button
                  onClick={generateKeywords}
                  disabled={loading || !aiAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Generate Keywords
                </button>
                {generatedKeywords && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mt-4 space-y-4`}>
                    {generatedKeywords.primaryKeywords && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Primary Keywords</label>
                        <div className="flex flex-wrap gap-2">
                          {generatedKeywords.primaryKeywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {generatedKeywords.longTailKeywords && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Long-Tail Keywords</label>
                        <div className="flex flex-wrap gap-2">
                          {generatedKeywords.longTailKeywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {generatedKeywords.questionKeywords && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Question Keywords</label>
                        <div className="flex flex-wrap gap-2">
                          {generatedKeywords.questionKeywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blog Posts Tab */}
          {activeTab === 'blog' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Generate Blog Post Ideas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="e.g., React Projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={blogTechStack}
                    onChange={(e) => setBlogTechStack(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                  />
                </div>
                <button
                  onClick={generateBlogPosts}
                  disabled={loading || !aiAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Generate Blog Ideas
                </button>
                {generatedBlogPosts && generatedBlogPosts.length > 0 && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mt-4 space-y-4`}>
                    {generatedBlogPosts.map((post, i) => (
                      <div key={i} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
                        <h3 className="font-bold mb-2">{post.title}</h3>
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {post.description}
                        </p>
                        {post.targetKeywords && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.targetKeywords.map((kw, j) => (
                              <span key={j} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Estimated: {post.estimatedWordCount} words
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Analysis Tab */}
          {activeTab === 'analyze' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Analyze Content for SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Content to Analyze *</label>
                  <textarea
                    value={analysisContent}
                    onChange={(e) => setAnalysisContent(e.target.value)}
                    rows={8}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="Paste your content here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={analysisKeywords}
                    onChange={(e) => setAnalysisKeywords(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <button
                  onClick={analyzeContent}
                  disabled={loading || !aiAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  Analyze Content
                </button>
                {analysisResult && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 mt-4 space-y-4`}>
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${analysisResult.score >= 80 ? 'text-green-500' : analysisResult.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {analysisResult.score}/100
                      </div>
                      <div>
                        <p className="font-semibold">SEO Score</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {analysisResult.score >= 80 ? 'Excellent' : analysisResult.score >= 60 ? 'Good' : 'Needs Improvement'}
                        </p>
                      </div>
                    </div>
                    {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-green-500">Strengths</label>
                        <ul className="list-disc list-inside space-y-1">
                          {analysisResult.strengths.map((strength, i) => (
                            <li key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-red-500">Weaknesses</label>
                        <ul className="list-disc list-inside space-y-1">
                          {analysisResult.weaknesses.map((weakness, i) => (
                            <li key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Suggestions</label>
                        <ul className="list-disc list-inside space-y-1">
                          {analysisResult.suggestions.map((suggestion, i) => (
                            <li key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.improvedContent && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold">Improved Content</label>
                          <button
                            onClick={() => copyToClipboard(analysisResult.improvedContent, 'improved')}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            {copied === 'improved' ? <FiCheck className="text-green-500" /> : <FiCopy />}
                          </button>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {analysisResult.improvedContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </AdminLayout>
  );
}

