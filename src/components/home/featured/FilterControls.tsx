
import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode, OrientationType, SortOption } from '@/hooks/useMediaFilters';
import CategoryFilters from './filters/CategoryFilters';
import FormatFilters from './filters/FormatFilters';
import SortSelector from './filters/SortSelector';
import ViewModeSelector from './filters/ViewModeSelector';

interface FilterControlsProps {
  categories: string[];
  activeCategory: string;
  orientation: OrientationType;
  viewMode: ViewMode;
  sortBy: SortOption;
  onCategoryChange: (category: string) => void;
  onOrientationChange: (orientation: OrientationType) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (sort: SortOption) => void;
}

const FilterControls = ({
  categories,
  activeCategory,
  orientation,
  viewMode,
  sortBy,
  onCategoryChange,
  onOrientationChange,
  onViewModeChange,
  onSortChange
}: FilterControlsProps) => {
  return (
    <motion.div 
      className="mb-8"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
      }}
    >
      {/* Top row: Categories */}
      <CategoryFilters 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
      
      {/* Bottom row: Filters and View Mode */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-4"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
          }
        }}
      >
        {/* Format filter */}
        <FormatFilters 
          orientation={orientation} 
          onOrientationChange={onOrientationChange} 
        />
        
        {/* View Mode & Sort */}
        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <SortSelector 
            sortBy={sortBy} 
            onSortChange={onSortChange} 
          />
          
          {/* View mode selector */}
          <ViewModeSelector 
            viewMode={viewMode} 
            onViewModeChange={onViewModeChange} 
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterControls;
