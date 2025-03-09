
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight, Tag, Gift } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart-items', []);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.sale_price !== null ? item.sale_price : item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const total = subtotal - discount;

  const handleRemoveItem = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id);
    setCartItems(newItems);
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart"
    });
  };

  const handleQuantityChange = (id: string, change: number) => {
    const newItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change); // Ensure min quantity is 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(newItems);
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart"
    });
  };

  const handleApplyPromo = () => {
    // Simple promo code for demonstration
    setIsApplyingPromo(true);
    
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'welcome10') {
        const discountAmount = subtotal * 0.1;
        setDiscount(discountAmount);
        toast({
          title: "Promo code applied",
          description: "You received 10% discount!"
        });
      } else if (promoCode.toLowerCase() === 'elvis20') {
        const discountAmount = subtotal * 0.2;
        setDiscount(discountAmount);
        toast({
          title: "Promo code applied",
          description: "You received 20% discount!"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid promo code",
          description: "The promo code you entered is invalid or expired"
        });
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout",
        variant: "destructive"
      });
      navigate('/login', { state: { returnUrl: '/cart' } });
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

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productIds: cartItems.map(item => item.id),
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "There was an issue with the checkout process",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        
        <div className="container mx-auto py-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto py-16"
          >
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-300 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/shop">
              <Button className="bg-elvis-gradient">
                Browse Products
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-elvis-medium rounded-lg overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearCart}
                  className="text-gray-400 hover:text-white hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
              
              <div className="divide-y divide-white/10">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {/* Product Image */}
                    {item.image && (
                      <div className="w-20 h-20 flex-shrink-0 bg-black rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-elvis-pink font-bold">
                          ${(item.sale_price !== null ? item.sale_price : item.price).toFixed(2)}
                        </span>
                        {item.sale_price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Total Price */}
                    <div className="text-right min-w-20">
                      <p className="font-bold">
                        ${((item.sale_price !== null ? item.sale_price : item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-white hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-elvis-medium rounded-lg overflow-hidden sticky top-24"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator className="bg-white/10" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-2">Have a promo code?</p>
                  <div className="flex space-x-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="bg-elvis-dark border-white/20"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyPromo}
                      disabled={!promoCode || isApplyingPromo}
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-elvis-gradient"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Gift className="h-4 w-4 mr-1" />
                    <span>Free access</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
