
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles,
  Grid3X3, 
  GalleryVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ViewMode } from '@/hooks/useMediaFilters';

interface FeaturedHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isInView: boolean;
}

const FeaturedHeader = ({ viewMode, onViewModeChange, isInView }: FeaturedHeaderProps) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-end justify-between mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-gradient">Featured</span> Projects
        </motion.h2>
        
        <motion.p 
          className="text-white/70 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Browse my collection of cinematic storytelling — from immersive vertical stories 
          to widescreen productions that capture the essence of each project.
        </motion.p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0">
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
        
        <Button asChild variant="link" className="text-elvis-pink flex items-center group">
          <Link to="/portfolio">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default FeaturedHeader;
