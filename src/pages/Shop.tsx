
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useSupabase';
import Cart from '@/components/Cart';
import { toast } from '@/components/ui/use-toast';
import { Tables } from '@/types/supabase';

type CartItem = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
};

const Shop = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Fetch products from Supabase
  const { data: products, isLoading } = useProducts();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Set loaded state for animations
  useEffect(() => {
    if (!isLoading && products) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [isLoading, products]);

  const addToCart = (product: Tables<'products'>) => {
    // Check if product is already in cart
    if (cartItems.some(item => item.id === product.id)) {
      toast({
        title: "Already in cart",
        description: `${product.name} is already in your cart.`,
      });
      return;
    }

    setCartItems(prev => [
      ...prev, 
      {
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        image: product.preview_image_url || '',
      }
    ]);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar>
        <Cart items={cartItems} onRemoveItem={removeFromCart} onClearCart={clearCart} />
      </Navbar>
      
      {/* Hero section */}
      <div className="pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-elvis-medium">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter">
            Premium <span className="text-gradient">LUT Collections</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Professional color grading tools to elevate your photography and videography projects with just one click.
          </p>
        </div>
      </div>
      
      {/* Products grid */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-elvis-dark">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="glass-card hover-card group"
                  style={{ 
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: isLoaded ? `fade-in 0.5s ease-out ${index * 0.1}s forwards` : 'none'
                  }}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img 
                      src={product.preview_image_url || 'https://images.unsplash.com/photo-1598899247309-201070376589?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'} 
                      alt={product.name} 
                      className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.is_featured && (
                      <div className="absolute top-4 right-4 bg-elvis-pink text-white text-xs font-medium px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                    {product.sale_price && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">4.8</span>
                      </div>
                      <span className="text-xs text-white/60">(42 reviews)</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-2xl font-bold text-elvis-pink">
                        {product.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span>${product.sale_price.toFixed(2)}</span>
                            <span className="text-sm text-white/60 line-through">${product.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span>${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <Button 
                        className="bg-elvis-gradient shadow-pink-glow"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/70">No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-elvis-medium">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Custom LUT Development
          </h2>
          <p className="text-white/70 mb-8">
            Need a custom look for your brand? We offer personalized LUT development services to match your specific visual style.
          </p>
          <Button className="bg-elvis-gradient px-8 py-6 text-lg shadow-pink-glow">
            Contact Us for Custom LUTs
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;
