
import React from 'react';
import { useChunkedVideo } from '@/hooks/useChunkedVideo';
import VideoPlayerControls from './VideoPlayerControls';
import VideoThumbnail from './VideoThumbnail';
import ChunkedVideoLoading from './ChunkedVideoLoading';
import ChunkedVideoError from './ChunkedVideoError';
import BufferOverlay from './BufferOverlay';
import ChunkIndicator from './ChunkIndicator';
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
  initialVolume = 0.7
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

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker`}
      data-testid="chunked-video-player"
    >
      {isPaused && (
        <VideoThumbnail
          thumbnail={thumbnail || '/placeholder.svg'}
          title={title}
          isVertical={isVertical}
          togglePlay={handlePlayPause}
        />
      )}
      
      {/* Main video element for current chunk */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full ${isVertical ? 'object-contain' : 'object-cover'}`}
        loop={chunkUrls.length === 1 && loop}
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
      
      <ChunkIndicator 
        currentChunk={currentChunk} 
        totalChunks={chunkUrls.length} 
      />
      
      {controls && (
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
    </div>
  );
};

export default ChunkedVideoPlayer;
