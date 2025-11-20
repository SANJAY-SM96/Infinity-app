'use client';

/* @refresh reset */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import authService from "../lib/api/authService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      }
      return null;
    } catch (error) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || null;
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  });

  const initializedRef = useRef(false);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const userData = response.data.user;
      const tokenData = response.data.token;

      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(tokenData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      // Extract error message from various possible locations
      let errorMessage = 'Login failed';

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          (Array.isArray(error.response.data?.errors)
            ? error.response.data.errors.map(e => e.msg || e.message).join(', ')
            : error.response.data?.errors) ||
          `Server error: ${error.response.status}`;

        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Login error details:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            message: errorMessage
          });
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check if the backend is running.';
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] No response from server:', error.request);
        }
      } else {
        // Error setting up the request
        errorMessage = error.message || 'Login failed';
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Request setup error:', error);
        }
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (name, email, password, userType) => {
    try {
      const response = await authService.register({ name, email, password, userType });
      const userData = response.data.user;
      const tokenData = response.data.token;

      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(tokenData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
    return { success: true };
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const response = await authService.updateProfile(data);
      const userData = response.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  }, []);

  const googleLogin = useCallback(() => {
    // Get API base URL (without /api suffix) - useful for OAuth redirects
    const getApiBaseUrl = () => {
      // In development mode, always use localhost
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:5000';
      }

      // In production, use VITE_API_URL if set, otherwise use default production URL
      if (process.env.NODE_ENV === 'production') {
        const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL;
        if (envUrl) {
          // Remove /api suffix if present
          return envUrl.replace(/\/api\/?$/, '');
        }
        return 'https://www.api.infinitywebtechnology.com';
      }

      // Fallback: use local backend
      return 'http://localhost:5000';
    };

    window.location.href = `${getApiBaseUrl()}/api/auth/google`;
  }, []);

  useEffect(() => {
    // Prevent duplicate initialization (React StrictMode protection)
    if (initializedRef.current) {
      return;
    }

    const initializeAuth = async () => {
      // Mark as initialized immediately to prevent duplicate calls
      initializedRef.current = true;

      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        const userData = response.data.user;
        const tokenData = response.data.token;

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        setUser(userData);
        setToken(tokenData);
        setIsAuthenticated(true);
      } catch (error) {
        // Handle rate limiting - don't clear auth on 429, just wait
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded during auth initialization. Will retry on next page load.');
          // Don't clear auth state on rate limit, just stop loading
          setLoading(false);
          return;
        }

        // Only log non-401 errors (401 is expected if token is invalid)
        if (error.response?.status !== 401) {
          console.error('Auth initialization error:', error);
        }
        // Token is invalid, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - only run once

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    googleLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // In development, provide a default context to prevent crashes
    // This can happen during React StrictMode double-rendering
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AuthContext] useAuth called outside AuthProvider, returning default values');
      return {
        user: null,
        token: null,
        loading: true,
        isAuthenticated: false,
        login: async () => ({ success: false, error: 'Auth not initialized' }),
        register: async () => ({ success: false, error: 'Auth not initialized' }),
        logout: async () => ({ success: true }),
        updateProfile: async () => ({ success: false, error: 'Auth not initialized' }),
        googleLogin: () => { }
      };
    }
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}