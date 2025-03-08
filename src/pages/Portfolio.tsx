
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

// Mock portfolio categories
const categories = ['All', 'Photography', 'Videography', 'Commercial', 'Personal'];

// Mock portfolio items
const portfolioItems = [
  { id: 1, title: 'Mountain Sunrise', category: 'Photography', image: 'https://images.unsplash.com/photo-1682685797660-3d847763691e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 2, title: 'Urban Style', category: 'Videography', image: 'https://images.unsplash.com/photo-1661956602153-23384936a1d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3', video: true },
  { id: 3, title: 'Ocean Horizon', category: 'Photography', image: 'https://images.unsplash.com/photo-1682685797229-b2930538da47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 4, title: 'Night City', category: 'Videography', image: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3', video: true },
  { id: 5, title: 'Product Showcase', category: 'Commercial', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 6, title: 'Fashion Week', category: 'Commercial', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3', video: true },
  { id: 7, title: 'Autumn Colors', category: 'Photography', image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 8, title: 'Personal Project', category: 'Personal', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3', video: true }
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(portfolioItems);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Filter items based on active category
    if (activeCategory === 'All') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === activeCategory));
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Set loaded state for animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      {/* Hero section */}
      <div className="pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-elvis-medium">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter">
            Our <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Explore our collection of visual stories and creative projects that showcase our passion for photography and videography.
          </p>
          
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`
                  rounded-full px-6
                  ${activeCategory === category ? 
                    'bg-elvis-gradient shadow-pink-glow' : 
                    'border-elvis-pink/50 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                  }
                `}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Portfolio grid */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-elvis-dark">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="portfolio-item group cursor-pointer"
                style={{ 
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: isLoaded ? `fade-in 0.5s ease-out ${index * 0.1}s forwards` : 'none'
                }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {item.video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-elvis-pink/30 backdrop-blur-md flex items-center justify-center">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="portfolio-caption">
                    <span className="text-sm text-elvis-pink font-medium">{item.category}</span>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
