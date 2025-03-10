
import React from 'react';
import BufferOverlay from '../BufferOverlay';

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  nextChunkRef: React.RefObject<HTMLVideoElement>;
  chunkUrls: string[];
  currentChunk: number;
  chunkData: any;
  isVertical: boolean;
  isMuted: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  handleTimeUpdate: () => void;
  handleMetadataLoaded: () => void;
  handleChunkEnded: () => void;
  handleVideoError: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  handleWaiting: () => void;
  handleCanPlay: () => void;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  videoRef,
  nextChunkRef,
  chunkUrls,
  currentChunk,
  chunkData,
  isVertical,
  isMuted,
  isPaused,
  isBuffering,
  handleTimeUpdate,
  handleMetadataLoaded,
  handleChunkEnded,
  handleVideoError,
  handleWaiting,
  handleCanPlay
}) => {
  return (
    <>
      {/* Main video element for current chunk */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full ${isVertical ? 'object-contain' : 'object-cover'}`}
        loop={chunkUrls.length === 1}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadataLoaded}
        onEnded={handleChunkEnded}
        onError={handleVideoError}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        style={{ opacity: isPaused ? 0 : 1 }}
      >
        {chunkUrls.length > 0 && (
          <source src={chunkUrls[currentChunk]} type={chunkData?.mime_type || 'video/mp4'} />
        )}
        Your browser does not support HTML video.
      </video>
      
      {/* Hidden video element for pre-buffering next chunk */}
      <video
        ref={nextChunkRef}
        className="hidden"
        preload="auto"
        muted
      >
        <source type={chunkData?.mime_type || 'video/mp4'} />
      </video>
      
      {isBuffering && !isPaused && <BufferOverlay />}
    </>
  );
};

export default VideoDisplay;
