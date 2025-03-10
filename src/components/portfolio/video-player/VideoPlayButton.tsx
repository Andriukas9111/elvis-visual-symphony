
import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type PlayButtonSize = 'sm' | 'md' | 'lg';

export interface VideoPlayButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: PlayButtonSize;
  icon?: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4'
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

const VideoPlayButton: React.FC<VideoPlayButtonProps> = ({
  onClick,
  size = 'md',
  icon,
  className
}) => {
  return (
    <motion.button
      className={cn("rounded-full bg-elvis-pink/90 backdrop-blur-sm", sizeClasses[size], className)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {icon || <Play className={cn("text-white", iconSizes[size])} fill="currentColor" />}
    </motion.button>
  );
};

export default VideoPlayButton;
