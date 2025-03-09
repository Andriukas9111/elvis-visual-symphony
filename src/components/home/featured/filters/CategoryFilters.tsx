
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 mb-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
    >
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "ghost"}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            activeCategory === category 
              ? 'bg-elvis-pink text-white shadow-pink-glow' 
              : 'bg-elvis-darker/50 text-white/70 hover:bg-elvis-pink/20'
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </motion.div>
  );
};

export default CategoryFilters;
