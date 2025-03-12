
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { formatTime } from '../ThumbnailGenerator/utils';

interface ThumbnailGridProps {
  thumbnails: Array<{ url: string; timestamp: number; isVertical?: boolean }>;
  selectedThumbnail: string | null;
  itemVariants: any;
  prefersReducedMotion: boolean;
  onSelectThumbnail: (url: string, isVertical: boolean) => void;
}

const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({
  thumbnails,
  selectedThumbnail,
  itemVariants,
  prefersReducedMotion,
  onSelectThumbnail
}) => {
  if (thumbnails.length === 0) return null;
  
  return (
    <motion.div
      className="space-y-3"
      variants={prefersReducedMotion ? {} : {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.05
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {thumbnails.map((thumb, index) => (
          <motion.div
            key={index}
            className={`relative ${thumb.isVertical ? 'aspect-[9/16]' : 'aspect-video'} rounded-md overflow-hidden border-2 cursor-pointer 
              ${selectedThumbnail === thumb.url 
                ? 'border-elvis-pink shadow-pink-glow' 
                : 'border-transparent hover:border-white/30'}`}
            variants={prefersReducedMotion ? {} : itemVariants}
            onClick={() => onSelectThumbnail(thumb.url, !!thumb.isVertical)}
          >
            <img 
              src={thumb.url} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {selectedThumbnail === thumb.url && (
              <div className="absolute top-1 right-1 bg-elvis-pink/80 rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            
            {thumb.timestamp > 0 && (
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                {formatTime(thumb.timestamp)}
              </div>
            )}
            
            {thumb.isVertical && (
              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                Vertical
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <p className="text-xs text-white/60">
        Click on a thumbnail to select it as the video preview image
      </p>
    </motion.div>
  );
};

export default ThumbnailGrid;
