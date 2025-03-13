
import React from 'react';
import { motion } from 'framer-motion';
import { ExtendedMedia } from '@/hooks/useMedia';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

interface MediaCardProps {
  media: ExtendedMedia;
  currentVideoId: string | null;
  onVideoPlay: (id: string) => void;
  index: number;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  media, 
  currentVideoId, 
  onVideoPlay, 
  index 
}) => {
  const isVideo = media.type === 'video';
  const isVertical = media.orientation === 'vertical';
  
  const getMediaUrl = () => {
    return `/portfolio/${media.slug || media.id}`;
  };

  // Helper function to get video URL
  const getVideoUrl = (): string => {
    // Use video_url if available, or video_id for YouTube videos, otherwise fall back to file_url
    if (media.video_url) {
      return media.video_url;
    } else if (media.video_id && typeof media.video_id === 'string') {
      return `https://www.youtube.com/embed/${media.video_id}`;
    } else if (media.file_url) {
      return media.file_url;
    }
    return '';
  };

  // Debug log
  console.log(`MediaCard ${media.id}: type=${media.type}, videoUrl=${getVideoUrl()}, thumbnail=${media.thumbnail_url || '/placeholder.svg'}`);

  const handleVideoPlay = (e: React.MouseEvent) => {
    if (isVideo) {
      // Prevent navigation when clicking on video or play button
      e.preventDefault();
      e.stopPropagation();
      onVideoPlay(media.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={getMediaUrl()}>
        <div className="overflow-hidden rounded-xl bg-elvis-dark hover:shadow-lg transition-all duration-300 hover:shadow-elvis-pink/20">
          {isVideo ? (
            <div onClick={handleVideoPlay}>
              <VideoPlayer
                videoUrl={getVideoUrl()}
                thumbnail={media.thumbnail_url || '/placeholder.svg'}
                title={media.title || 'Untitled'}
                isVertical={isVertical}
                onPlay={() => onVideoPlay(media.id)}
                autoPlay={false}
                muted={true}
                controls={true}
                loop={false}
              />
            </div>
          ) : (
            <AspectRatio ratio={isVertical ? 9/16 : 16/9}>
              <img
                src={media.file_url || '/placeholder.svg'}
                alt={media.title || 'Media item'}
                className="object-cover rounded-lg w-full h-full"
              />
            </AspectRatio>
          )}
          
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white">{media.title}</h3>
            {media.description && (
              <p className="mt-2 text-gray-300 text-sm line-clamp-2">{media.description}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MediaCard;
