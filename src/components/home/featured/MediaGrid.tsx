
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase';
import MediaCard from './MediaCard';

interface MediaGridProps {
  media: Tables<'media'>[];
  currentVideoId: string | null;
  onVideoPlay: (id: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, currentVideoId, onVideoPlay }) => {
  useEffect(() => {
    // Debug info about media items
    console.log(`Rendering MediaGrid with ${media?.length || 0} items`);
    if (media?.length === 0) {
      console.log('No media items found. This could indicate a database connection issue.');
    }
  }, [media]);

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item variants for individual card animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {media && media.length > 0 ? (
        media.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <MediaCard 
              item={item} 
              isPlaying={currentVideoId === item.id}
              onPlay={() => onVideoPlay(item.id)}
            />
          </motion.div>
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <p className="text-gray-400">No media items available. Please check back later.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MediaGrid;
