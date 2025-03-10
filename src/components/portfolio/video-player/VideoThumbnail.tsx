
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  isVertical: boolean;
  togglePlay: () => void;
  isYoutube?: boolean;
  hideTitle?: boolean;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  isVertical,
  togglePlay,
  isYoutube = false,
  hideTitle = true // Changed default to true to hide title on hover
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log("Image failed to load:", thumbnail);
    setImageError(true);
  };

  return (
    <>
      {!imageError ? (
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-elvis-darker flex items-center justify-center">
          <p className="text-white/60 text-sm">Thumbnail unavailable</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-elvis-pink/80 backdrop-blur-md flex items-center justify-center"
          onClick={togglePlay}
        >
          <Play className="h-8 w-8 text-white fill-white ml-1" />
        </motion.div>
      </div>
      {!hideTitle && (
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-lg font-bold text-white drop-shadow-md">{title}</h3>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm flex items-center gap-1">
        {isYoutube ? (
          <>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            YouTube
          </>
        ) : (
          isVertical ? 'Vertical' : 'Horizontal'
        )}
      </div>
    </>
  );
};

export default VideoThumbnail;
