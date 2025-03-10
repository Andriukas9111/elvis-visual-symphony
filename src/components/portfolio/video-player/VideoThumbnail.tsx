
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import VideoPlayButton, { PlayButtonSize } from './VideoPlayButton';
import VideoErrorState from './VideoErrorState';

export interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  togglePlay: (e: React.MouseEvent) => void;
  isYoutube?: boolean;
  hideTitle?: boolean;
  error?: string | null;
  playButtonSize?: PlayButtonSize;
  customPlayButton?: React.ReactNode;
  customErrorState?: React.ReactNode;
  showMediaType?: boolean;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  isVertical = false,
  togglePlay,
  isYoutube = false,
  hideTitle = false,
  error = null,
  playButtonSize = 'lg',
  customPlayButton,
  customErrorState,
  showMediaType = true,
  className,
  imageClassName,
  contentClassName,
  titleClassName
}) => {
  return (
    <div className={cn("absolute inset-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      
      <img 
        src={thumbnail || '/placeholder.svg'} 
        alt={title}
        className={cn(
          "w-full h-full", 
          isVertical ? "object-contain" : "object-cover", 
          imageClassName
        )}
        onError={(e) => {
          console.error("Thumbnail load error for:", thumbnail);
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {customErrorState || <VideoErrorState message={typeof error === 'string' ? error : "Click to try again"} />}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {customPlayButton || <VideoPlayButton onClick={togglePlay} size={playButtonSize} />}
        </div>
      )}
      
      {!hideTitle && (
        <div className={cn("absolute left-0 right-0 bottom-0 p-4 z-20", contentClassName)}>
          <h3 className={cn("text-lg font-bold text-white", titleClassName)}>{title}</h3>
          {showMediaType && isYoutube && (
            <span className="text-sm text-white/70">YouTube Video</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
