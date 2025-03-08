
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';

// Mock products
const products = [
  {
    id: 1,
    name: 'Cinematic LUT Pack Vol. 1',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1598899247309-201070376589?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.8,
    reviews: 124,
    label: 'Best Seller',
    description: 'Transform your footage with 20 premium cinematic LUTs inspired by Hollywood blockbusters.'
  },
  {
    id: 2,
    name: 'Urban Night LUT Collection',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.7,
    reviews: 89,
    label: 'New',
    description: 'Create moody urban night vibes with these 15 carefully crafted LUTs for city and street photography.'
  },
  {
    id: 3,
    name: 'Natural Light Portrait Pack',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1600132806608-231446b2e7af?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.9,
    reviews: 56,
    description: 'Enhance portrait photography with 12 LUTs designed specifically for natural lighting conditions.'
  },
  {
    id: 4,
    name: 'Vintage Film Emulation Pack',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1577640905050-83665af216b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.6,
    reviews: 42,
    description: 'Recreate the look of classic film stocks with these 18 carefully crafted film emulation LUTs.'
  },
  {
    id: 5,
    name: 'Travel & Landscape Collection',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.8,
    reviews: 73,
    description: 'Enhance your travel and landscape photography with 25 versatile LUTs for various environments.'
  },
  {
    id: 6,
    name: 'Ultimate Creator Bundle',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5.0,
    reviews: 31,
    label: 'Best Value',
    description: 'Complete collection of 80+ premium LUTs for every scenario, plus bonus transitions and effects.'
  }
];

const Shop = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Set loaded state for animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
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
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.label && (
                    <div className="absolute top-4 right-4 bg-elvis-pink text-white text-xs font-medium px-3 py-1 rounded-full">
                      {product.label}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-white/60">({product.reviews} reviews)</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-2xl font-bold text-elvis-pink">${product.price}</div>
                    <Button className="bg-elvis-gradient shadow-pink-glow">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
