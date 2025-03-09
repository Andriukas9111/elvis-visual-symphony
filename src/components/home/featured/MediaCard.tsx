
import React from 'react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase';
import VideoPlayer from '@/components/portfolio/VideoPlayer';

interface MediaCardProps {
  item: Tables<'media'>;
  isPlaying: boolean;
  onPlay: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, isPlaying, onPlay }) => {
  // Determine if the media is a video and has a video URL
  const hasVideo = item.type === 'video' && item.video_url;
  
  // Use thumbnail if available, otherwise use the main URL
  const thumbnail = item.thumbnail_url || item.url;
  
  // Determine if the video is vertical
  const isVertical = item.orientation === 'vertical';

  return (
    <motion.div 
      className="bg-elvis-dark rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {hasVideo ? (
        <VideoPlayer 
          videoUrl={item.video_url || ''} 
          thumbnail={thumbnail} 
          title={item.title}
          isVertical={isVertical}
          onPlay={onPlay}
        />
      ) : (
        <div className={`aspect-${isVertical ? '[9/16]' : 'video'} relative overflow-hidden`}>
          <img 
            src={item.url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-gray-300 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags?.map((tag, index) => (
            <span 
              key={index} 
              className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;
