
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioCard, { PortfolioItem } from './PortfolioCard';

// Sample portfolio items with videos in different formats
const portfolioItems: PortfolioItem[] = [
  { 
    id: 1, 
    title: 'Urban Fashion', 
    category: 'Commercial', 
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    format: 'reel',
    description: 'Urban fashion shoot in downtown Miami',
    featured: true 
  },
  { 
    id: 2, 
    title: 'Coastal Sunset', 
    category: 'Nature', 
    image: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?q=80&w=1770&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    format: 'widescreen',
    description: 'Beautiful sunset captured at Malibu beach'
  },
  { 
    id: 3, 
    title: 'Dance Performance', 
    category: 'Entertainment', 
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1974&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-under-neon-lights-3739-large.mp4',
    format: 'reel',
    description: 'Contemporary dance showcase in New York'
  },
  { 
    id: 4, 
    title: 'Urban Timelapse', 
    category: 'Cityscape', 
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-urban-landscape-seen-from-a-distance-with-reflections-in-glass-4857-large.mp4',
    format: 'widescreen',
    description: 'New York City timelapse at night'
  },
  { 
    id: 5, 
    title: 'Product Showcase', 
    category: 'Commercial', 
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1796&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-smartphone-into-front-jeans-pocket-1205-large.mp4',
    format: 'reel',
    description: 'Premium product video for athletic shoes'
  },
  { 
    id: 6, 
    title: 'Mountain Adventure', 
    category: 'Nature', 
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1770&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    format: 'widescreen',
    description: 'Epic mountain landscape cinematography',
    featured: true
  },
  { 
    id: 7, 
    title: 'Street Festival', 
    category: 'Events', 
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-pouring-a-drink-4156-large.mp4',
    format: 'reel',
    description: 'Vibrant street festival in Barcelona'
  },
  { 
    id: 8, 
    title: 'Aerial Coastline', 
    category: 'Nature', 
    image: 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=1772&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-shore-with-some-people-walking-around-4016-large.mp4',
    format: 'widescreen',
    description: 'Stunning drone footage of Mediterranean coastline'
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
  
  // Create a custom grid class that handles both reel and widescreen formats
  const defaultGridClass = 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto gap-4';
  
  // For "featured" view, we'll use a custom masonry-like layout
  const featuredGridClass = 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-auto';
  
  // Use the provided grid class or default to our responsive grid
  const gridClasses = gridClassName || defaultGridClass;
  
  // If no items found after filtering
  if (filteredItems.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-white/70">No items found in this category.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid ${gridClassName === 'grid-auto-featured' ? featuredGridClass : defaultGridClass}`}>
      {filteredItems.map((item, index) => {
        // For the featured layout, determine the grid span based on format and featured status
        let spanClasses = '';
        
        if (gridClassName === 'grid-auto-featured') {
          if (item.featured && item.format === 'widescreen') {
            spanClasses = 'md:col-span-6 lg:col-span-8 row-span-1';
          } else if (item.featured && item.format === 'reel') {
            spanClasses = 'md:col-span-3 lg:col-span-4 row-span-2';
          } else if (!item.featured && item.format === 'widescreen') {
            spanClasses = 'md:col-span-6 lg:col-span-6 row-span-1';
          } else { // reel format, not featured
            spanClasses = 'md:col-span-2 lg:col-span-3 row-span-2';
          }
        }
        
        return (
          <div key={item.id} className={spanClasses}>
            <PortfolioCard
              item={item}
              index={index}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioGrid;
