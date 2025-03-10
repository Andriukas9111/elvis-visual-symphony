
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase';
import { useAnimation } from '@/contexts/AnimationContext';
import MediaCardMedia from './MediaCardMedia';
import MediaCardContent from './MediaCardContent';

interface MediaCardProps {
  item: Tables<'media'>;
  isPlaying: boolean;
  onPlay: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, isPlaying, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { prefersReducedMotion } = useAnimation();
  
  // Enhanced logging for debugging
  useEffect(() => {
    console.log('MediaCard rendering:', { 
      id: item.id, 
      title: item.title,
      type: item.type,
      orientation: item.orientation
    });
  }, [item]);
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    hover: { 
      y: prefersReducedMotion ? 0 : -5,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    }
  };

  return (
    <motion.div 
      className="bg-elvis-dark rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
      variants={!prefersReducedMotion ? cardVariants : {}}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layoutId={`media-card-${item.id}`}
    >
      <MediaCardMedia 
        item={item} 
        isPlaying={isPlaying} 
        onPlay={onPlay}
        isHovered={isHovered}
      />
      
      <MediaCardContent item={item} />
    </motion.div>
  );
};

export default MediaCard;
