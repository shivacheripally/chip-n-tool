import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart with Firebase when user logs in
  useEffect(() => {
    const syncCartWithFirebase = async () => {
      if (isAuthenticated && user) {
        try {
          // Get cart from Firebase
          const cartDoc = await getDoc(doc(db, 'carts', user.id));
          if (cartDoc.exists()) {
            const firebaseCart = cartDoc.data().items || [];
            
            // Merge local cart with Firebase cart
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const mergedCart = [...firebaseCart];
            
            localCart.forEach((localItem: CartItem) => {
              const existingIndex = mergedCart.findIndex(
                item => item.product.id === localItem.product.id
              );
              if (existingIndex >= 0) {
                mergedCart[existingIndex].quantity += localItem.quantity;
              } else {
                mergedCart.push(localItem);
              }
            });
            
            setCart(mergedCart);
            
            // Update Firebase with merged cart
            await setDoc(doc(db, 'carts', user.id), { items: mergedCart });
            
            // Clear local storage
            localStorage.removeItem('cart');
          } else {
            // Save current cart to Firebase
            if (cart.length > 0) {
              await setDoc(doc(db, 'carts', user.id), { items: cart });
              localStorage.removeItem('cart');
            }
          }
        } catch (error) {
          console.error('Error syncing cart with Firebase:', error);
        }
      }
    };

    syncCartWithFirebase();
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Save to Firebase if user is logged in
      const saveToFirebase = async () => {
        try {
          await setDoc(doc(db, 'carts', user.id), { items: cart });
        } catch (error) {
          console.error('Error saving cart to Firebase:', error);
        }
      };
      saveToFirebase();
    } else {
      // Save to localStorage if user is not logged in
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If product already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Otherwise add new item
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price.current * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};