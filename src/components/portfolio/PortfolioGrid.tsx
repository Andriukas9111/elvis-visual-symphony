
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioCard, { PortfolioItem } from './PortfolioCard';

// Extended portfolio items with more details
const portfolioItems: PortfolioItem[] = [
  { 
    id: 1, 
    title: 'Mountain Sunrise', 
    category: 'Photography', 
    image: 'https://images.unsplash.com/photo-1682685797660-3d847763691e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Stunning sunrise captured over mountain peaks',
    featured: true 
  },
  { 
    id: 2, 
    title: 'Urban Style', 
    category: 'Videography', 
    image: 'https://images.unsplash.com/photo-1661956602153-23384936a1d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Dynamic urban fashion video project',
    video: true, 
    videoUrl: 'https://example.com/video1.mp4' 
  },
  { 
    id: 3, 
    title: 'Ocean Horizon', 
    category: 'Photography', 
    image: 'https://images.unsplash.com/photo-1682685797229-b2930538da47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Tranquil seascape at sunset'
  },
  { 
    id: 4, 
    title: 'Night City', 
    category: 'Videography', 
    image: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Cinematic night city timelapse',
    video: true,
    videoUrl: 'https://example.com/video2.mp4'
  },
  { 
    id: 5, 
    title: 'Product Showcase', 
    category: 'Commercial', 
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Premium product photography'
  },
  { 
    id: 6, 
    title: 'Fashion Week', 
    category: 'Commercial', 
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Behind the scenes at Fashion Week',
    video: true,
    videoUrl: 'https://example.com/video3.mp4'
  },
  { 
    id: 7, 
    title: 'Autumn Colors', 
    category: 'Photography', 
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Vibrant autumn landscape series'
  },
  { 
    id: 8, 
    title: 'Personal Project', 
    category: 'Personal', 
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Experimental personal video project',
    video: true,
    videoUrl: 'https://example.com/video4.mp4',
    featured: true
  }
];

interface PortfolioGridProps {
  category: string;
  gridClassName?: string;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ 
  category,
  gridClassName
}) => {
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  
  useEffect(() => {
    // Filter items based on active category
    if (category === 'All') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === category));
    }
  }, [category]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };
  
  // If using featured view, adjust the grid class
  const gridClasses = gridClassName || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  
  // If no items found after filtering
  if (filteredItems.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-white/70">No items found in this category.</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={`grid ${gridClasses}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnimatePresence mode="wait">
        {filteredItems.map((item, index) => (
          <PortfolioCard 
            key={item.id} 
            item={item} 
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default PortfolioGrid;
