
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag } from 'lucide-react';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface CartItem {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
}

const Shop = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tables<'products'>[];
    }
  });

  // Filter products by category
  const filteredProducts = selectedCategory 
    ? products?.filter(product => product.category === selectedCategory)
    : products;

  // Get unique categories
  const categories = [...new Set(products?.map(product => product.category))];

  const addToCart = (product: Tables<'products'>) => {
    setCartItems(prev => {
      // Check if item is already in cart
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        image: product.preview_image_url || '',
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shop</h1>
          
          <div className="flex items-center gap-4">
            <Cart 
              items={cartItems}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />
            
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filter
            </Button>
          </div>
        </div>
        
        {/* Filter sidebar */}
        {isFilterOpen && (
          <div className="mb-8 p-4 bg-elvis-medium rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              
              {categories?.map(category => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Products grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-elvis-pink" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Error loading products. Please try again.</p>
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-gray-400">
              {selectedCategory 
                ? `No products in the "${selectedCategory}" category.` 
                : "There are no products available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts?.map(product => (
              <div key={product.id} className="bg-elvis-medium rounded-lg overflow-hidden">
                {product.preview_image_url && (
                  <img 
                    src={product.preview_image_url} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  
                  <div className="mb-4">
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <span className="text-elvis-pink font-bold">${product.sale_price.toFixed(2)}</span>
                        <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-elvis-pink font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-gray-300 mb-4 line-clamp-3">{product.description}</p>
                  )}
                  
                  <Button 
                    className="w-full bg-elvis-gradient"
                    onClick={() => addToCart(product)}
                    disabled={cartItems.some(item => item.id === product.id)}
                  >
                    {cartItems.some(item => item.id === product.id) 
                      ? "Added to Cart" 
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;
