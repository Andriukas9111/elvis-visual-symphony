
import React from 'react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase';
import MediaCard from './MediaCard';

interface MediaGridProps {
  media: Tables<'media'>[];
  currentVideoId: string | null;
  onVideoPlay: (id: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, currentVideoId, onVideoPlay }) => {
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
      {media.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <MediaCard 
            item={item} 
            isPlaying={currentVideoId === item.id}
            onPlay={() => onVideoPlay(item.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MediaGrid;
