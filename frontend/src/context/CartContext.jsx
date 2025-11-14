import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartService } from '../api/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart({ productId, quantity });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

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
