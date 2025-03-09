
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MediaItem, ViewMode } from '@/hooks/useMediaFilters';
import VideoPlayer from '@/components/portfolio/VideoPlayer';

interface MediaCardProps {
  item: MediaItem;
  isFeatured?: boolean;
  viewMode: ViewMode;
  onPlay: () => void;
}

const MediaCard = ({ item, isFeatured = false, viewMode, onPlay }: MediaCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isVertical = item.orientation === 'vertical';
  const thumbnailUrl = item.thumbnail_url || item.url;
  
  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
  };
  
  const cardClasses = `
    relative overflow-hidden rounded-xl 
    ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}
    ${viewMode === 'list' ? 'h-40 md:h-56' : 'h-full'}
    ${isFeatured ? 'h-full' : ''}
    transform transition-all duration-300 hover:shadow-xl
    ${isFeatured ? 'hover:scale-[1.01]' : 'hover:scale-[1.03]'}
    bg-elvis-darker/40 backdrop-blur-sm shadow-lg
  `;
  
  return (
    <motion.div
      className={cardClasses}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <VideoPlayer
        videoUrl={item.video_url || ''}
        thumbnail={thumbnailUrl}
        title={item.title || ''}
        isVertical={isVertical}
        onPlay={handlePlay}
      />
      
      {/* Category badge */}
      {item.category && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-elvis-pink/80 text-white backdrop-blur-sm">{item.category}</Badge>
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-white drop-shadow-md group-hover:text-elvis-pink transition-colors">{item.title}</h3>
              <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.description}</p>
            </div>
            
            <Link to={`/portfolio/${item.slug}`} onClick={(e) => e.stopPropagation()} className="text-elvis-pink hover:text-white">
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MediaCard;
