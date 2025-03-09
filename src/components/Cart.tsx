
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Loader2, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
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

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart-items', []);
  const [cartAnimation, setCartAnimation] = useState(false);

  // Calculate totals
  const total = cartItems.reduce((sum, item) => {
    const price = item.sale_price !== null ? item.sale_price : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);

  // Find or update item quantity
  const findItemIndex = (id: string) => cartItems.findIndex(item => item.id === id);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const index = findItemIndex(item.id);
    
    if (index >= 0) {
      // Item exists, update quantity
      const newItems = [...cartItems];
      newItems[index].quantity = (newItems[index].quantity || 1) + 1;
      setCartItems(newItems);
    } else {
      // Add new item
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    
    // Show animation
    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 1000);
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (id: string, change: number) => {
    const index = findItemIndex(id);
    if (index === -1) return;

    const newItems = [...cartItems];
    const newQuantity = (newItems[index].quantity || 1) + change;
    
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      newItems.splice(index, 1);
    } else {
      // Update quantity
      newItems[index].quantity = newQuantity;
    }
    
    setCartItems(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout",
        variant: "destructive"
      });
      setIsOpen(false);
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    // Navigate to full cart/checkout page
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <ShoppingCart className={`h-5 w-5 ${cartAnimation ? 'text-elvis-pink animate-pulse' : ''}`} />
            {cartItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-elvis-pink text-xs text-white"
              >
                {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </motion.span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          
          <div className="mt-8 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                <p className="text-gray-500 mt-1">Add products to get started</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between border-b border-gray-200 pb-4"
                      layout
                    >
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm font-medium text-elvis-pink">
                            ${(item.sale_price !== null ? item.sale_price : item.price).toFixed(2)}
                          </p>
                          
                          <div className="flex items-center mt-1 space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-6 text-center text-sm">{item.quantity || 1}</span>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm font-semibold">
                          ${((item.sale_price !== null ? item.sale_price : item.price) * (item.quantity || 1)).toFixed(2)}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-7 w-7 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <span className="text-base font-medium">Total</span>
                    <motion.span 
                      key={total}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold text-elvis-pink"
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-row">
            {cartItems.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
                <Button 
                  className="w-full bg-elvis-gradient"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Export the addToCart function */}
      {/* This is a trick to expose the function to the global window object */}
      <div style={{ display: 'none' }} id="cart-api" data-add-to-cart={JSON.stringify(addToCart)} />
    </>
  );
};

// Export a way to access the addToCart function from other components
export const useCart = () => {
  const [addToCart, setAddToCart] = useState<(item: Omit<CartItem, 'quantity'>) => void>(() => {
    // Default implementation that will be replaced once component mounts
    return () => console.warn('Cart not initialized yet');
  });

  useEffect(() => {
    const checkCartAPI = () => {
      const cartAPI = document.getElementById('cart-api');
      if (cartAPI) {
        try {
          // Get the function from the data attribute
          const addToCartFn = JSON.parse(cartAPI.getAttribute('data-add-to-cart') || '{}');
          if (typeof addToCartFn === 'function') {
            setAddToCart(() => addToCartFn);
          }
        } catch (e) {
          console.error('Error initializing cart API:', e);
        }
      } else {
        // If cart API not found, try again in a moment
        setTimeout(checkCartAPI, 200);
      }
    };

    checkCartAPI();
  }, []);

  return { addToCart };
};

export default Cart;
