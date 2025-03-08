
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onRemoveItem,
  onClearCart
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const total = items.reduce((sum, item) => {
    const price = item.sale_price !== null ? item.sale_price : item.price;
    return sum + price;
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productIds: items.map(item => item.id),
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
      // Close the cart and clear it
      setIsOpen(false);
      onClearCart();
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "There was an issue with the checkout process",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-elvis-pink text-xs text-white">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
              <p className="text-gray-500 mt-1">Add products to get started</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
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
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-lg font-bold text-elvis-pink">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-row">
          {items.length > 0 && (
            <>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClearCart}
              >
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
                  "Checkout"
                )}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
