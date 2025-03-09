
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Maximize, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tables } from '@/types/supabase';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
  video: Tables<'media'>;
  isVertical?: boolean;
  isFeatured?: boolean;
  viewMode?: 'grid' | 'featured' | 'list';
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  isVertical = false,
  isFeatured = false,
  viewMode = 'grid'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const closeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsExpanded(false);
  };
  
  // Extract YouTube video ID
  const getYoutubeId = (url: string = '') => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const videoId = video.video_url ? getYoutubeId(video.video_url) : null;
  const thumbnailUrl = video.thumbnail_url || video.url;
  
  const cardClasses = `
    relative overflow-hidden rounded-xl 
    ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}
    ${viewMode === 'list' ? 'h-40 md:h-56' : 'h-full'}
    ${isFeatured ? 'h-full' : ''}
    cursor-pointer group
    transform transition-all duration-300 hover:shadow-lg
    ${isFeatured ? 'hover:scale-[1.01]' : 'hover:scale-[1.03]'}
    bg-elvis-darker/40 backdrop-blur-sm
  `;
  
  const videoPlayerClasses = `
    absolute inset-0 z-20 
    ${isExpanded ? 'fixed top-0 left-0 w-screen h-screen bg-black/95' : ''}
  `;
  
  return (
    <motion.div
      className={cardClasses}
      onClick={togglePlay}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {!isPlaying ? (
        <>
          {/* Thumbnail */}
          <img 
            src={thumbnailUrl || '/placeholder.svg'} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-elvis-pink/80 backdrop-blur-md flex items-center justify-center"
            >
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </motion.div>
          </div>
          
          {/* Video details */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white drop-shadow-md group-hover:text-elvis-pink transition-colors">{video.title}</h3>
                {viewMode !== 'grid' && (
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">{video.description}</p>
                )}
              </div>
              
              {viewMode === 'list' && (
                <Link to={`/portfolio/${video.slug}`} onClick={(e) => e.stopPropagation()} className="text-elvis-pink hover:text-white">
                  <ExternalLink className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
          
          {/* Orientation badge */}
          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm z-10">
            {isVertical ? 'Vertical' : 'Widescreen'}
          </div>
          
          {/* Category badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-elvis-pink/80 text-white backdrop-blur-sm">{video.category}</Badge>
          </div>
        </>
      ) : (
        <motion.div 
          className={videoPlayerClasses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Control buttons */}
          <div className="absolute top-4 right-4 z-30 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
              onClick={toggleExpand}
            >
              <Maximize className="h-5 w-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
              onClick={closeVideo}
            >
              <X className="h-5 w-5 text-white" />
            </motion.button>
          </div>
          
          {/* YouTube embed */}
          {videoId ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker">
              <p className="text-white/70">Video not available</p>
            </div>
          )}
          
          {/* Title overlay at the bottom */}
          <div className={`absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent ${isExpanded ? 'hidden' : ''}`}>
            <h3 className="text-lg font-bold text-white">{video.title}</h3>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VideoCard;
