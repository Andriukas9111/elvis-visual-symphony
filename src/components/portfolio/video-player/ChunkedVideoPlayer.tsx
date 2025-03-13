
import React from 'react';
import { useChunkedVideo } from '@/hooks/chunkedVideo';
import ChunkedVideoLoading from './ChunkedVideoLoading';
import ChunkedVideoError from './ChunkedVideoError';
import VideoDisplay from './chunked/VideoDisplay';
import VideoOverlay from './chunked/VideoOverlay';
import { VideoErrorData } from './utils';

interface ChunkedVideoProps {
  videoId: string;
  thumbnail?: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  loop?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  onError?: (error: VideoErrorData) => void;
  initialVolume?: number;
  hideOverlayText?: boolean;
}

const ChunkedVideoPlayer: React.FC<ChunkedVideoProps> = ({
  videoId,
  thumbnail,
  title,
  isVertical = false,
  onPlay,
  loop = false,
  autoPlay = false,
  controls = true,
  muted = false,
  onError,
  initialVolume = 0.7,
  hideOverlayText = true
}) => {
  const {
    videoRef,
    nextChunkRef,
    status,
    errorMessage,
    chunkUrls,
    currentChunk,
    isPaused,
    volume,
    isMuted,
    duration,
    currentTime,
    loadingProgress,
    isBuffering,
    handlePlayPause,
    handleVolumeChange,
    handleMuteToggle,
    handleTimeUpdate,
    handleSeek,
    handleMetadataLoaded,
    handleChunkEnded,
    handleVideoError,
    handleWaiting,
    handleCanPlay,
    chunkData
  } = useChunkedVideo({
    videoId,
    onError,
    autoPlay,
    muted,
    loop,
    initialVolume,
    onPlay
  });

  if (status === 'loading') {
    return <ChunkedVideoLoading loadingProgress={loadingProgress} />;
  }

  if (status === 'error') {
    return <ChunkedVideoError errorMessage={errorMessage} />;
  }

  const effectiveThumbnail = thumbnail || '/placeholder.svg';

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker`}
      data-testid="chunked-video-player"
    >
      <VideoDisplay 
        videoRef={videoRef}
        nextChunkRef={nextChunkRef}
        chunkUrls={chunkUrls}
        currentChunk={currentChunk}
        chunkData={chunkData}
        isVertical={isVertical}
        isMuted={isMuted}
        isPaused={isPaused}
        isBuffering={isBuffering}
        handleTimeUpdate={handleTimeUpdate}
        handleMetadataLoaded={handleMetadataLoaded}
        handleChunkEnded={handleChunkEnded}
        handleVideoError={handleVideoError}
        handleWaiting={handleWaiting}
        handleCanPlay={handleCanPlay}
      />
      
      <VideoOverlay 
        isPaused={isPaused}
        thumbnail={effectiveThumbnail}
        title={title}
        isVertical={isVertical}
        currentChunk={currentChunk}
        totalChunks={chunkUrls.length}
        duration={duration}
        currentTime={currentTime}
        volume={volume}
        isMuted={isMuted}
        isBuffering={isBuffering}
        showControls={controls}
        handlePlayPause={handlePlayPause}
        handleVolumeChange={handleVolumeChange}
        handleMuteToggle={handleMuteToggle}
        handleSeek={handleSeek}
        hideOverlayText={hideOverlayText}
      />
    </div>
  );
};

export default ChunkedVideoPlayer;
