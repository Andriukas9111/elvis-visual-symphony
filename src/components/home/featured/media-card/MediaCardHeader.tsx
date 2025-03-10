
import React from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';

interface MediaCardHeaderProps {
  type: string;
}

const MediaCardHeader: React.FC<MediaCardHeaderProps> = ({ type }) => {
  // Determine if the media is a video
  const hasVideo = type === 'video';
  
  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="bg-elvis-darker/80 backdrop-blur-sm p-1.5 rounded-full">
        {hasVideo ? (
          <Film className="w-4 h-4 text-elvis-pink" />
        ) : (
          <ImageIcon className="w-4 h-4 text-elvis-pink" />
        )}
      </div>
    </div>
  );
};

export default MediaCardHeader;
