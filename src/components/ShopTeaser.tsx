
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useSupabase';

const ShopTeaser = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Fetch featured products from Supabase
  const { data: products, isLoading } = useProducts({ 
    featured: true,
    limit: 3
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={`py-24 px-6 md:px-12 lg:px-24 bg-elvis-dark relative section-animate ${isVisible ? 'animate-in' : ''}`}
    >
      {/* Background elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-elvis-pink/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-elvis-purple/10 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm uppercase tracking-wider text-elvis-pink font-medium bg-elvis-pink/10 px-3 py-1 rounded-full">
            Premium LUTs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 tracking-tighter">
            Elevate Your Visual Content with Our <span className="text-gradient">Color Grading Tools</span>
          </h2>
          <p className="text-white/70">
            Professional LUTs designed to transform your footage with cinematic color grading in just one click.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="glass-card hover-card group"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  opacity: 0,
                  animation: isVisible ? `fade-in 0.5s ease-out ${index * 0.2}s forwards` : 'none'
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
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="text-2xl font-bold text-elvis-pink mb-4">
                    {product.sale_price ? (
                      <div className="flex items-center gap-2">
                        <span>${product.sale_price.toFixed(2)}</span>
                        <span className="text-sm text-white/60 line-through">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <Button asChild className="w-full bg-elvis-gradient group">
                    <Link to={`/shop`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70">Featured products coming soon!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-elvis-pink text-white px-8 hover:bg-elvis-pink/10">
            <Link to="/shop">Explore All Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopTeaser;
