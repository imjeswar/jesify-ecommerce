import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types/product.types';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // Only use local storage as an initial fallback before DB loads
    const storedCart = localStorage.getItem('jesify_cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch cart from DB when user logs in
  useEffect(() => {
    if (user && user.email) {
      fetch(`${API_URL}/api/cart/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);
          }
          setIsLoaded(true);
        })
        .catch(err => {
          console.error("Failed to load cart from DB", err);
          setIsLoaded(true);
        });
    } else {
      // If no user, we consider it loaded from localstorage
      setIsLoaded(true);
    }
  }, [user]);

  // Sync cart changes to DB or localStorage
  useEffect(() => {
    if (!isLoaded) return; // Don't sync while initial loading

    if (user && user.email) {
      // Sync to DB
      fetch(`${API_URL}/api/cart/${user.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      }).catch(err => console.error("Failed to sync cart to DB", err));
    } else {
      // Sync to local storage for anonymous users
      localStorage.setItem('jesify_cart', JSON.stringify(items));
    }
  }, [items, user, isLoaded]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
