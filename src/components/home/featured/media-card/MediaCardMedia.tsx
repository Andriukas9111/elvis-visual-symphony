
import React from 'react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { useAnimation } from '@/contexts/AnimationContext';
import MediaCardHeader from './MediaCardHeader';
import MediaCardFooter from './MediaCardFooter';

interface MediaCardMediaProps {
  item: Tables<'media'>;
  isPlaying: boolean;
  onPlay: () => void;
  isHovered: boolean;
}

const MediaCardMedia: React.FC<MediaCardMediaProps> = ({ 
  item, 
  isPlaying, 
  onPlay,
  isHovered 
}) => {
  const { prefersReducedMotion } = useAnimation();
  
  // Determine if the media is a video
  const hasVideo = item.type === 'video';
  
  // Get the video URL - use video_url if available, otherwise use url
  const videoUrl = item.video_url || (hasVideo ? item.url : '');
  
  // Use thumbnail if available, otherwise use url for proper display
  const thumbnail = item.thumbnail_url || item.url;
  
  // Determine if the video is vertical
  const isVertical = item.orientation === 'vertical';

  return (
    <div className={`relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden group`}>
      {/* Media type indicator */}
      <MediaCardHeader type={item.type} />

      {/* Media content */}
      {hasVideo ? (
        <VideoPlayer 
          videoUrl={videoUrl} 
          thumbnail={thumbnail} 
          title={item.title}
          isVertical={isVertical}
          onPlay={onPlay}
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
              console.error("Image load error for:", item.url);
              (e.target as HTMLImageElement).src = '/placeholder.svg'; 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      )}
      
      {/* Play button/footer for images */}
      {!hasVideo && (
        <MediaCardFooter id={item.id} onPlay={onPlay} />
      )}
    </div>
  );
};

export default MediaCardMedia;
