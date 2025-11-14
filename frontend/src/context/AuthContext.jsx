import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import authService from "../api/authService";

const AuthContext = createContext();

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
      return { success: false, error: error.response?.data?.message || 'Login failed' };
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

  useEffect(() => {
    // Prevent duplicate initialization (React StrictMode protection)
    if (initializedRef.current) {
      return;
    }
    
    const initializeAuth = async () => {
      // Mark as initialized immediately to prevent duplicate calls
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
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}