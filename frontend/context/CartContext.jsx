'use client';

/* @refresh reset */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { cartService } from '../lib/api/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get auth context - must be called unconditionally (React hooks rule)
  // The AuthProvider wraps CartProvider in App.jsx, so this should always work
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;

  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  const fetchCart = useCallback(async (retryCount = 0) => {
    if (!isAuthenticated) {
      setCart(null);
      fetchingRef.current = false;
      return;
    }

    // Prevent concurrent fetches and rate limiting
    if (fetchingRef.current) {
      return;
    }

    // Throttle requests - don't fetch if last fetch was less than 1 second ago
    const now = Date.now();
    if (now - lastFetchRef.current < 1000 && retryCount === 0) {
      return;
    }

    fetchingRef.current = true;
    lastFetchRef.current = now;

    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data.cart);
      fetchingRef.current = false;
    } catch (error) {
      fetchingRef.current = false;

      // Handle rate limiting with exponential backoff
      if (error.response?.status === 429 && retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
        setTimeout(() => {
          fetchCart(retryCount + 1);
        }, delay);
        return;
      }

      // Don't log 429 errors as they're handled above
      if (error.response?.status !== 429) {
        console.error('Failed to fetch cart:', error);
      }
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart on mount and when authentication changes
  useEffect(() => {
    // Small delay to avoid race conditions with auth initialization
    const timer = setTimeout(() => {
      fetchCart();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }
    try {
      const response = await cartService.addToCart({ productId, quantity });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    }
  }, [isAuthenticated]);

  const updateCartItem = useCallback(async (itemId, quantity) => {
    try {
      const response = await cartService.updateItem(itemId, { quantity });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const response = await cartService.removeItem(itemId);
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      const response = await cartService.clearCart();
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartCount: cart?.itemCount || 0,
    cartTotal: cart?.total || 0
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
