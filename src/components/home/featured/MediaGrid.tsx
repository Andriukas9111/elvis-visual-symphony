
import React from 'react';
import { ExtendedMedia } from '@/hooks/useMedia';
import MediaCard from './MediaCard';

interface MediaGridProps {
  media: ExtendedMedia[];
  currentVideoId: string | null;
  onVideoPlay: (id: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, currentVideoId, onVideoPlay }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {media.map((item, index) => (
        <MediaCard
          key={item.id}
          media={item}
          currentVideoId={currentVideoId}
          onVideoPlay={onVideoPlay}
          index={index}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
