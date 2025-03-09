
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MediaItem, ViewMode } from '@/hooks/useMediaFilters';
import MediaCard from './MediaCard';
import { toast } from 'sonner';

interface MediaGridProps {
  media: MediaItem[];
  viewMode: ViewMode;
  onResetFilters: () => void;
}

const MediaGrid = ({ 
  media, 
  viewMode, 
  onResetFilters 
}: MediaGridProps) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const getGridClassName = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      case 'featured':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6';
      case 'list':
        return 'flex flex-col gap-4';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  const handleVideoPlay = (itemId: string) => {
    setActiveVideoId(itemId);
    toast.success(`Now playing: ${media.find(item => item.id === itemId)?.title || 'Video'}`, {
      position: 'bottom-right',
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${viewMode}-${media.length}`}
        className={getGridClassName()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
      >
        {media.length > 0 ? (
          media.map((item, index) => (
            <motion.div
              key={item.id}
              className={`
                ${viewMode === 'featured' 
                  ? index === 0 
                    ? 'md:col-span-8 row-span-2' 
                    : 'md:col-span-4'
                  : ''
                }
                ${viewMode === 'list' ? 'w-full' : ''}
              `}
              variants={itemVariants}
            >
              <MediaCard
                item={item}
                isFeatured={viewMode === 'featured' && index === 0}
                viewMode={viewMode}
                onPlay={() => handleVideoPlay(item.id)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="col-span-full text-center py-16"
            variants={itemVariants}
          >
            <div className="bg-elvis-darker/50 rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-white/60 mb-4">No projects match your current filters.</p>
              <Button 
                variant="secondary" 
                onClick={onResetFilters}
                className="bg-elvis-pink/20 hover:bg-elvis-pink text-white"
              >
                Reset Filters
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaGrid;
