
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag } from 'lucide-react';
import Cart from '@/components/Cart';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface CartItem {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
}

const Shop = () => {
  // Use the CartContext instead of local state
  const { addItem } = useCart();
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

  const handleAddToCart = (product: Tables<'products'>) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: product.preview_image_url || '',
    });
  };

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shop</h1>
          
          <div className="flex items-center gap-4">
            <Cart />
            
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filter
            </Button>
          </div>
        </div>
        
        {/* CTA for Before/After Showcase */}
        <div className="mb-8 p-6 bg-elvis-gradient rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">See the Transformation</h2>
              <p className="text-white/90">
                Check out our interactive before/after comparison tool to see the dramatic effects of our LUTs.
              </p>
            </div>
            <Link to="/before-after">
              <Button className="bg-white text-elvis-pink hover:bg-white/90">
                View Showcase
              </Button>
            </Link>
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
              <div key={product.id} className="bg-elvis-medium rounded-lg overflow-hidden group hover:shadow-pink-glow transition-shadow duration-300">
                <Link to={`/product/${product.slug || product.id}`} className="block">
                  {product.preview_image_url && (
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={product.preview_image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {product.sale_price && (
                        <div className="absolute top-3 right-3 bg-elvis-pink text-white px-2 py-1 rounded-full text-xs font-semibold">
                          SALE
                        </div>
                      )}
                    </div>
                  )}
                </Link>
                
                <div className="p-4">
                  <Link to={`/product/${product.slug || product.id}`} className="block">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-elvis-pink transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mb-4">
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <span className="text-elvis-pink font-bold">${product.sale_price.toFixed(2)}</span>
                        <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
                        <span className="ml-auto bg-elvis-pink/20 text-elvis-pink text-xs px-2 py-1 rounded-full">
                          {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-elvis-pink font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-elvis-gradient"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    
                    <Link to={`/product/${product.slug || product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
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
