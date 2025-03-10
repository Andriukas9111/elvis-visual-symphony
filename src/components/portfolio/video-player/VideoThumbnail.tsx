
import React from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  togglePlay?: () => void;
  isYoutube?: boolean;
  hideTitle?: boolean;
  error?: string | null;
  className?: string; // Added className prop
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  isVertical = false,
  togglePlay,
  isYoutube,
  hideTitle = false,
  error = null,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      
      <img 
        src={thumbnail || '/placeholder.svg'} 
        alt={title}
        className={`w-full h-full ${isVertical ? 'object-contain' : 'object-cover'}`}
        onError={(e) => {
          console.error("Thumbnail load error:", thumbnail);
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="bg-elvis-darker/90 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-white/70 text-center px-4">Click to try again</p>
        </div>
      ) : togglePlay && (
        <motion.button
          className="absolute inset-0 flex items-center justify-center z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
        >
          <div className="bg-elvis-pink/90 backdrop-blur-sm p-4 rounded-full">
            <Play className="h-8 w-8 text-white" fill="currentColor" />
          </div>
        </motion.button>
      )}
      
      {!hideTitle && (
        <div className="absolute left-0 right-0 bottom-0 p-4 z-20">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {isYoutube && (
            <span className="text-sm text-white/70">YouTube Video</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
