
import React from 'react';
import { motion } from 'framer-motion';
import { ExtendedMedia } from '@/hooks/useMedia';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

interface MediaGridProps {
  media: ExtendedMedia[];
  currentVideoId: string | null;
  onVideoPlay: (id: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, currentVideoId, onVideoPlay }) => {
  const getMediaUrl = (item: ExtendedMedia) => {
    if (item.type === 'video') {
      // For videos, use the video_id field for our internal system
      return `/portfolio/${item.slug || item.id}`;
    } else {
      return `/portfolio/${item.slug || item.id}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {media.map((item, index) => {
        const isVideo = item.type === 'video';
        const isVertical = item.orientation === 'vertical';
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <Link to={getMediaUrl(item)}>
              <div className="overflow-hidden rounded-xl bg-elvis-dark hover:shadow-lg transition-all duration-300 hover:shadow-elvis-pink/20">
                {isVideo ? (
                  <VideoPlayer
                    videoUrl={item.video_id || item.video_url || ''}
                    thumbnail={item.thumbnail_url || '/placeholder.svg'}
                    title={item.title || 'Untitled'}
                    isVertical={isVertical}
                    onPlay={() => onVideoPlay(item.id)}
                    autoPlay={false}
                    muted={true}
                    controls={true}
                  />
                ) : (
                  <AspectRatio ratio={isVertical ? 9/16 : 16/9}>
                    <img
                      src={item.file_url || '/placeholder.svg'}
                      alt={item.title || 'Media item'}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </AspectRatio>
                )}
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-gray-300 text-sm line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
