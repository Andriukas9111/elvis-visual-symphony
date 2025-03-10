
import React from 'react';

interface MediaCardFooterProps {
  id: string;
  onPlay: () => void;
}

const MediaCardFooter: React.FC<MediaCardFooterProps> = ({ id, onPlay }) => {
  const handlePlay = () => {
    console.log("MediaCardFooter: Play button clicked for item:", id);
    onPlay();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
      <button 
        onClick={handlePlay}
        className="w-full bg-elvis-pink/80 hover:bg-elvis-pink text-white rounded-md py-1.5 text-sm font-medium transition-colors"
      >
        Play Media
      </button>
    </div>
  );
};

export default MediaCardFooter;
