import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../api/authService';
import { getApiBaseUrl } from '../../utils/constants';
import { 
  FiCopy, 
  FiCheck, 
  FiExternalLink, 
  FiRefreshCw, 
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiLink
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOAuthConfig() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${getApiBaseUrl()}/api/auth/google/config`);
      const data = await response.json();
      
      if (data.success) {
        setConfig(data);
      } else {
        setError(data.message || 'Failed to fetch configuration');
      }
    } catch (err) {
      console.error('Error fetching OAuth config:', err);
      setError('Failed to connect to backend. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const openGoogleConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Google OAuth Configuration</h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View and configure Google OAuth callback URLs
            </p>
          </div>
          <button
            onClick={fetchConfig}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-red-900/20 border-red-500/50 text-red-400'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiXCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Not Configured State */}
        {!error && config && !config.configured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg border ${
              isDark
                ? 'bg-yellow-900/20 border-yellow-500/50'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} mt-1`} />
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  Google OAuth Not Configured
                </h3>
                <p className={isDark ? 'text-yellow-300' : 'text-yellow-700'}>
                  Google OAuth credentials are not set. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your backend environment variables.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configured State */}
        {config && config.configured && (
          <>
            {/* Callback URL Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiLink className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className="text-xl font-semibold">Callback URL</h2>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  Configured
                </div>
              </div>

              <div className="space-y-4">
                {/* Callback URL Display */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Current Callback URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={config.callbackURL}
                      className={`flex-1 px-4 py-3 rounded-lg border font-mono text-sm ${
                        isDark
                          ? 'bg-gray-900 border-gray-600 text-gray-300'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={() => copyToClipboard(config.callbackURL)}
                      className={`px-4 py-3 rounded-lg transition-colors ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <FiCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <FiCopy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Source: {config.source}
                  </p>
                </div>

                {/* Info Box */}
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <FiInfo className={`w-5 h-5 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        isDark ? 'text-blue-300' : 'text-blue-800'
                      }`}>
                        Important
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-blue-400' : 'text-blue-700'
                      }`}>
                        This exact URL must be registered in Google Cloud Console. Copy it above and add it to your OAuth 2.0 Client ID's "Authorized redirect URIs".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instructions Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Setup Instructions</h2>
                <button
                  onClick={openGoogleConsole}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Open Google Console
                  <FiExternalLink className="w-4 h-4" />
                </button>
              </div>

              <ol className="space-y-3">
                {config.instructions.map((instruction, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`flex-1 pt-0.5 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {instruction}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } p-6 shadow-sm`}
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => copyToClipboard(config.callbackURL)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <FiCopy className="w-5 h-5" />
                  Copy Callback URL
                </button>
                <button
                  onClick={openGoogleConsole}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FiExternalLink className="w-5 h-5" />
                  Open Google Cloud Console
                </button>
              </div>
            </motion.div>

            {/* Common URLs to Add */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-lg border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } p-6 shadow-sm`}
            >
              <h2 className="text-xl font-semibold mb-4">Common URLs to Add</h2>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Add these URLs to your Google Cloud Console for different environments:
              </p>
              <div className="space-y-2">
                {[
                  'https://www.api.infinitywebtechnology.com/api/auth/google/callback',
                  'https://api.infinitywebtechnology.com/api/auth/google/callback',
                  'http://localhost:5000/api/auth/google/callback'
                ].map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
                  >
                    <code className={`flex-1 font-mono text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(url)}
                      className={`p-2 rounded transition-colors ${
                        isDark
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                      }`}
                      title="Copy URL"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

