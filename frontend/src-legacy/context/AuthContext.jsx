/* @refresh reset */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import authService from "../api/authService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const initializedRef = useRef(false);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const userData = response.data.user;
      const tokenData = response.data.token;

      // Check if user is verified
      if (userData.isVerified === false) {
        return {
          success: false,
          requiresVerification: true,
          error: 'Please verify your email address',
          email: email
        };
      }

      // Trigger animation
      setIsLoggingIn(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(tokenData);
      setIsAuthenticated(true);
      setIsLoggingIn(false);
      return { success: true };
    } catch (error) {
      setIsLoggingIn(false);
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          (Array.isArray(error.response.data?.errors)
            ? error.response.data.errors.map(e => e.msg || e.message).join(', ')
            : error.response.data?.errors) ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the backend is running.';
      } else {
        errorMessage = error.message || 'Login failed';
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (name, email, password, userType) => {
    try {
      await authService.register({ name, email, password, userType });
      // Do not set auth state here, wait for OTP verification
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    try {
      const response = await authService.verifyOTP({ email, otp });
      const userData = response.data.user;
      const tokenData = response.data.token;

      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(tokenData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Verification failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      // Wait for animation to play
      await new Promise(resolve => setTimeout(resolve, 2000));

      await authService.logout();
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setIsLoggingOut(false);
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
    const getApiBaseUrl = () => {
      if (import.meta.env.DEV) {
        return 'http://localhost:5000';
      }
      if (import.meta.env.PROD) {
        const envUrl = import.meta.env.VITE_API_URL;
        if (envUrl) {
          return envUrl.replace(/\/api\/?$/, '');
        }
        return 'https://www.api.infinitywebtechnology.com';
      }
      return 'http://localhost:5000';
    };

    window.location.href = `${getApiBaseUrl()}/api/auth/google`;
  }, []);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    const initializeAuth = async () => {
      initializedRef.current = true;

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
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded during auth initialization.');
          setLoading(false);
          return;
        }

        if (error.response?.status !== 401) {
          console.error('Auth initialization error:', error);
        }
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
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isLoggingOut,
    isLoggingIn,
    login,
    register,
    verifyOTP,
    logout,
    updateProfile,
    googleLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    if (import.meta.env.DEV) {
      console.warn('[AuthContext] useAuth called outside AuthProvider, returning default values');
      return {
        user: null,
        token: null,
        loading: true,
        isAuthenticated: false,
        isLoggingOut: false,
        isLoggingIn: false,
        login: async () => ({ success: false, error: 'Auth not initialized' }),
        register: async () => ({ success: false, error: 'Auth not initialized' }),
        verifyOTP: async () => ({ success: false, error: 'Auth not initialized' }),
        logout: async () => ({ success: true }),
        updateProfile: async () => ({ success: false, error: 'Auth not initialized' }),
        googleLogin: () => { }
      };
    }
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}