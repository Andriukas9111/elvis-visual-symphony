
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
  className?: string;
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
  // Default placeholder for failed thumbnails
  const fallbackThumbnail = '/placeholder.svg';
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 z-10" />
      
      <img 
        src={thumbnail || fallbackThumbnail} 
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Thumbnail load error:", thumbnail);
          (e.target as HTMLImageElement).src = fallbackThumbnail;
        }}
        loading="lazy"
        style={{
          objectPosition: 'center',
          willChange: 'transform'
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
      
      {/* Completely removed title overlay */}
    </div>
  );
};

export default VideoThumbnail;
