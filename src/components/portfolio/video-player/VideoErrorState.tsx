
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoErrorStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

const VideoErrorState: React.FC<VideoErrorStateProps> = ({
  message = "Click to try again",
  icon,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="bg-elvis-darker/90 p-4 rounded-full mb-4">
        {icon || <AlertCircle className="h-8 w-8 text-red-500" />}
      </div>
      <p className="text-white/70 text-center px-4">{message}</p>
    </div>
  );
};

export default VideoErrorState;
