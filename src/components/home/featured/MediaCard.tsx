
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExtendedMedia } from '@/hooks/useMedia';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MediaCardProps {
  media: ExtendedMedia;
  index: number;
  onVideoPlay?: (id: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, index, onVideoPlay }) => {
  const isVideo = media.type === 'video';
  const isVertical = media.orientation === 'vertical';
  
  const handleVideoPlay = () => {
    if (onVideoPlay) {
      onVideoPlay(media.id);
    }
  };

  const getMediaUrl = () => {
    if (isVideo) {
      return `/portfolio/${media.slug || media.id}`;
    } else {
      return `/portfolio/${media.slug || media.id}`;
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
            <VideoPlayer
              videoUrl={media.video_id || media.video_url || ''}
              thumbnail={media.thumbnail_url || '/placeholder.svg'}
              title={media.title || 'Untitled'}
              isVertical={isVertical}
              onPlay={handleVideoPlay}
              autoPlay={false}
              muted={true}
              controls={true}
            />
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
