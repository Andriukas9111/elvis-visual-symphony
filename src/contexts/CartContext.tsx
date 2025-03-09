
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart-items', []);
  const [cartAnimation, setCartAnimation] = useState(false);

  // Calculate cart metrics
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.sale_price !== null ? item.sale_price : item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const total = subtotal; // Add tax, shipping, etc. if needed

  // Add item to cart
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    // Show animation
    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 1000);
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, change: number) => {
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === id);
      
      if (itemIndex === -1) return prevItems;
      
      const newItems = [...prevItems];
      const newQuantity = newItems[itemIndex].quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item if quantity becomes zero or negative
        newItems.splice(itemIndex, 1);
      } else {
        // Update quantity
        newItems[itemIndex].quantity = newQuantity;
      }
      
      return newItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const cartContextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    total,
  };

  return <CartContext.Provider value={cartContextValue}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
