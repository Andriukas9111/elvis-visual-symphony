
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortfolioFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const PortfolioFilter: React.FC<PortfolioFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full px-6 relative overflow-hidden",
            "border-elvis-pink/30 hover:border-elvis-pink hover:bg-elvis-pink/5"
          )}
          onClick={() => onCategoryChange(category)}
        >
          <span className="relative z-10">{category}</span>
          
          {activeCategory === category && (
            <motion.div
              className="absolute inset-0 bg-elvis-gradient"
              layoutId="activeCategoryBg"
              initial={false}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />
          )}
        </Button>
      ))}
    </div>
  );
};

export default PortfolioFilter;
