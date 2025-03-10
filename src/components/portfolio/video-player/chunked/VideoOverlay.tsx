
import React from 'react';
import VideoPlayerControls from '../VideoPlayerControls';
import VideoThumbnail from '../VideoThumbnail';
import ChunkIndicator from '../ChunkIndicator';

interface VideoOverlayProps {
  isPaused: boolean;
  thumbnail: string;
  title: string;
  isVertical: boolean;
  currentChunk: number;
  totalChunks: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  showControls: boolean;
  handlePlayPause: () => void;
  handleVolumeChange: (value: number) => void;
  handleMuteToggle: () => void;
  handleSeek: (time: number) => void;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  isPaused,
  thumbnail,
  title,
  isVertical,
  currentChunk,
  totalChunks,
  duration,
  currentTime,
  volume,
  isMuted,
  isBuffering,
  showControls,
  handlePlayPause,
  handleVolumeChange,
  handleMuteToggle,
  handleSeek
}) => {
  return (
    <>
      {isPaused && (
        <VideoThumbnail
          thumbnail={thumbnail}
          title={title}
          isVertical={isVertical}
          togglePlay={handlePlayPause}
        />
      )}
      
      <ChunkIndicator 
        currentChunk={currentChunk} 
        totalChunks={totalChunks} 
      />
      
      {showControls && (
        <VideoPlayerControls
          playing={!isPaused}
          loading={isBuffering}
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          muted={isMuted}
          bufferProgress={0}
          onPlayPause={handlePlayPause}
          onMute={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          title={title}
          togglePlay={handlePlayPause}
        />
      )}
    </>
  );
};

export default VideoOverlay;
