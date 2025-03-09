
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tables } from '@/types/supabase';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { useAnimation } from '@/contexts/AnimationContext';

interface MediaCardProps {
  item: Tables<'media'>;
  isPlaying: boolean;
  onPlay: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, isPlaying, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { prefersReducedMotion } = useAnimation();
  
  // Determine if the media is a video
  const hasVideo = item.type === 'video';
  
  // Get the video URL - use video_url if available, otherwise use url
  const videoUrl = item.video_url || (hasVideo ? item.url : '');
  
  // Use thumbnail if available, otherwise use the main URL
  const thumbnail = item.thumbnail_url || item.url;
  
  // Determine if the video is vertical
  const isVertical = item.orientation === 'vertical';

  // For debugging
  useEffect(() => {
    console.log('MediaCard item:', { 
      id: item.id, 
      hasVideo, 
      videoUrl, 
      thumbnail, 
      isVertical 
    });
  }, [item.id, hasVideo, videoUrl, thumbnail, isVertical]);
  
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

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  const tagVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const tagContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const handlePlay = () => {
    // Call the parent's onPlay handler with this item's ID
    onPlay();
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
      <div className={`relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden`}>
        {/* Media content */}
        {hasVideo ? (
          <VideoPlayer 
            videoUrl={videoUrl} 
            thumbnail={thumbnail} 
            title={item.title}
            isVertical={isVertical}
            onPlay={handlePlay}
            hideOverlayText={true}
          />
        ) : (
          <motion.div 
            className="w-full h-full"
            animate={{ scale: isHovered && !prefersReducedMotion ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log("Image load error for:", item.url);
                (e.target as HTMLImageElement).src = '/placeholder.svg'; 
              }}
            />
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="p-4 flex flex-col flex-grow"
        variants={!prefersReducedMotion ? contentVariants : {}}
      >
        <motion.h3 
          className="text-xl font-bold text-white mb-2"
          layoutId={`media-title-${item.id}`}
        >
          {item.title}
        </motion.h3>
        
        {item.description && (
          <motion.p 
            className="text-gray-300 line-clamp-2 mb-auto"
            layoutId={`media-desc-${item.id}`}
          >
            {item.description}
          </motion.p>
        )}
        
        {item.tags && item.tags.length > 0 && (
          <motion.div 
            className="mt-3 flex flex-wrap gap-2"
            variants={!prefersReducedMotion ? tagContainerVariants : {}}
            initial="initial"
            animate="animate"
          >
            {item.tags.map((tag, index) => (
              <motion.span 
                key={index} 
                className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300 border border-elvis-pink/20"
                variants={!prefersReducedMotion ? tagVariants : {}}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 0, 255, 0.1)" }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MediaCard;
