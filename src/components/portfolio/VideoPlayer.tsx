
import React from 'react';

const VideoPlayer = ({ videoUrl, thumbnail, title }: { videoUrl?: string, thumbnail?: string, title?: string }) => {
  return (
    <div className="w-full h-full bg-elvis-dark">
      <video 
        src={videoUrl} 
        poster={thumbnail} 
        controls 
        className="w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
