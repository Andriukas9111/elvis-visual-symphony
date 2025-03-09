
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Grid3X3, 
  GalleryVertical,
  Film,
  Camera,
  SlidersHorizontal,
  Clock,
  SortAsc,
  Shuffle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewMode, OrientationType, SortOption } from '@/hooks/useMediaFilters';

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
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
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
      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        variants={itemVariants}
      >
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
      </motion.div>
      
      {/* Bottom row: Filters and View Mode */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-4"
        variants={itemVariants}
      >
        {/* Format filter */}
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
        
        {/* View Mode & Sort */}
        <div className="flex items-center gap-4">
          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 border-elvis-pink/50 flex items-center gap-1">
              <SortAsc className="w-3 h-3" /> Sort
            </Badge>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="w-[140px] bg-elvis-darker/50 border-elvis-pink/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-elvis-darker border-elvis-pink/20">
                <SelectItem value="newest" className="text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Newest
                  </div>
                </SelectItem>
                <SelectItem value="oldest" className="text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Oldest
                  </div>
                </SelectItem>
                <SelectItem value="title" className="text-white">
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-3 w-3" /> Title
                  </div>
                </SelectItem>
                <SelectItem value="random" className="text-white">
                  <div className="flex items-center gap-2">
                    <Shuffle className="h-3 w-3" /> Random
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* View mode selector */}
          <TooltipProvider>
            <div className="border border-elvis-pink/30 rounded-full p-1 flex bg-elvis-darker/50">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`p-1 rounded-full ${viewMode === 'featured' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                    onClick={() => onViewModeChange('featured')}
                    aria-label="Featured view"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Featured View</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`p-1 rounded-full ${viewMode === 'grid' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                    onClick={() => onViewModeChange('grid')}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`p-1 rounded-full ${viewMode === 'list' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                    onClick={() => onViewModeChange('list')}
                    aria-label="List view"
                  >
                    <GalleryVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterControls;
