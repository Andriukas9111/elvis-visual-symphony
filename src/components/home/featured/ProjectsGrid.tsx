
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/portfolio/VideoCard';
import { MediaItem, ViewMode, OrientationType } from '@/hooks/useMediaFilters';

interface ProjectsGridProps {
  filteredVideos: MediaItem[];
  viewMode: ViewMode;
  activeCategory: string;
  orientation: OrientationType;
  onResetFilters: () => void;
}

const ProjectsGrid = ({ 
  filteredVideos, 
  viewMode, 
  activeCategory,
  orientation,
  onResetFilters
}: ProjectsGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${viewMode}-${orientation}-${activeCategory}`}
        className={`grid gap-6 
          ${viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : viewMode === 'featured' 
              ? 'grid-cols-1 md:grid-cols-12 lg:grid-cols-12' 
              : 'grid-cols-1'}`
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
      >
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              className={`${
                viewMode === 'featured' 
                  ? index === 0 
                    ? 'md:col-span-8 lg:col-span-8 row-span-2' 
                    : 'md:col-span-4 lg:col-span-4'
                  : ''
              }`}
              variants={itemVariants}
            >
              <VideoCard
                video={video}
                isVertical={video.orientation === 'vertical'}
                isFeatured={viewMode === 'featured' && index === 0}
                viewMode={viewMode}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="col-span-full text-center py-16"
            variants={itemVariants}
          >
            <p className="text-white/60 mb-4">No videos match your current filters.</p>
            <Button 
              variant="outline" 
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectsGrid;
