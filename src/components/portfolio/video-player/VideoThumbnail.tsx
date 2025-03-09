
import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  isVertical: boolean;
  togglePlay: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  isVertical,
  togglePlay
}) => {
  return (
    <>
      <img 
        src={thumbnail} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-elvis-pink/80 backdrop-blur-md flex items-center justify-center"
        >
          <Play className="h-8 w-8 text-white fill-white ml-1" />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold text-white drop-shadow-md">{title}</h3>
      </div>
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm">
        {isVertical ? 'Vertical' : 'Horizontal'}
      </div>
    </>
  );
};

export default VideoThumbnail;
