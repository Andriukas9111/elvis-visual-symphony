
import React from 'react';
import { motion } from 'framer-motion';
import { OrientationType } from '@/hooks/useMediaFilters';
import { SlidersHorizontal, Film, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  orientation: OrientationType;
  onCategoryChange: (category: string) => void;
  onOrientationChange: (orientation: OrientationType) => void;
  isInView: boolean;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  orientation,
  onCategoryChange,
  onOrientationChange,
  isInView
}: CategoryFilterProps) => {
  return (
    <motion.div
      className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex-1">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category 
                  ? 'bg-elvis-pink text-white shadow-pink-glow' 
                  : 'bg-elvis-darker/50 text-white/70 hover:bg-elvis-pink/20'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="px-3 py-1 border-elvis-pink/50 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Format
        </Badge>
        <div className="flex bg-elvis-darker/50 rounded-full p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full px-3 py-1 text-xs ${orientation === 'all' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
            onClick={() => onOrientationChange('all')}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'horizontal' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
            onClick={() => onOrientationChange('horizontal')}
          >
            <Film className="w-3 h-3 mr-1" /> Widescreen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'vertical' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
            onClick={() => onOrientationChange('vertical')}
          >
            <Camera className="w-3 h-3 mr-1" /> Vertical
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
