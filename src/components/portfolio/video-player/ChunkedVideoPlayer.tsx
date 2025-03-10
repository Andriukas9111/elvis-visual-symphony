import React, { useEffect, useState, useRef } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { getChunkedVideo, getChunkUrls } from '@/utils/upload/mediaDatabase';
import { Progress } from '@/components/ui/progress';
import VideoPlayerControls from './VideoPlayerControls';
import VideoThumbnail from './VideoThumbnail';
import { VideoErrorData, VideoErrorType, logVideoError } from './utils';

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
  const [status, setStatus] = useState<'loading' | 'buffering' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [chunkData, setChunkData] = useState<any>(null);
  const [chunkUrls, setChunkUrls] = useState<string[]>([]);
  const [currentChunk, setCurrentChunk] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(muted);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchChunkedVideo = async () => {
      try {
        console.log('Fetching chunked video metadata for ID:', videoId);
        setStatus('loading');
        
        const data = await getChunkedVideo(videoId);
        if (!data) {
          throw new Error('Video not found');
        }
        
        console.log('Chunked video data:', data);
        setChunkData(data);
        
        const urls = await getChunkUrls(data.chunk_files, data.storage_bucket);
        console.log(`Got ${urls.length} chunk URLs`);
        
        if (!urls || urls.length === 0) {
          throw new Error('Could not retrieve video chunks');
        }
        
        setChunkUrls(urls);
        setStatus('ready');
        setLoadingProgress(100);
      } catch (error) {
        console.error('Error loading chunked video:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to load video');
        
        if (onError) {
          onError({
            type: VideoErrorType.LOAD,
            message: error.message || 'Failed to load chunked video',
            timestamp: Date.now()
          });
        }
      }
    };

    if (videoId) {
      fetchChunkedVideo();
    }
  }, [videoId, onError]);

  const handlePlayPause = () => {
    if (status !== 'ready') return;
    
    if (isPaused) {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPaused(false);
            if (!hasPlayedRef.current && onPlay) {
              onPlay();
              hasPlayedRef.current = true;
            }
          }).catch(error => {
            console.error('Error playing video:', error);
            if (error.name === 'NotAllowedError') {
              console.log('Video playback requires user interaction first');
            }
          });
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, value));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleChunkEnded = () => {
    if (currentChunk < chunkUrls.length - 1) {
      setCurrentChunk(prev => prev + 1);
      setIsBuffering(true);
    } else if (loop) {
      setCurrentChunk(0);
    } else {
      setIsPaused(true);
    }
  };

  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', event);
    setStatus('error');
    
    const videoElement = event.currentTarget;
    const errorCode = videoElement.error?.code;
    const errorMessage = videoElement.error?.message || 'Unknown video error';
    
    setErrorMessage(errorMessage);
    
    if (onError) {
      onError({
        type: VideoErrorType.MEDIA,
        message: errorMessage,
        code: errorCode,
        timestamp: Date.now()
      });
    }
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handleCanPlay = () => {
    setIsBuffering(false);
  };

  useEffect(() => {
    if (status === 'ready' && autoPlay && videoRef.current && !hasPlayedRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPaused(false);
          hasPlayedRef.current = true;
        }).catch(e => {
          console.log('Auto-play prevented by browser:', e);
        });
      }
    }
  }, [status, autoPlay]);

  useEffect(() => {
    if (videoRef.current && chunkUrls.length > 0 && currentChunk < chunkUrls.length) {
      videoRef.current.src = chunkUrls[currentChunk];
      
      if (!isPaused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error('Error playing next chunk:', e);
          });
        }
      }
    }
  }, [currentChunk, chunkUrls, isPaused]);

  if (status === 'loading') {
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin mb-2" />
        <p className="text-white/70">Loading chunked video...</p>
        <div className="w-2/3 mt-4">
          <Progress value={loadingProgress} className="h-2" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center">
        <div className="flex flex-col items-center text-center px-4">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">Video Playback Error</h3>
          <p className="text-white/70 text-sm">{errorMessage || 'Failed to load chunked video'}</p>
        </div>
      </div>
    );
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
      
      {isBuffering && !isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
      )}
      
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
      
      {chunkUrls.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white z-20">
          Chunk {currentChunk + 1}/{chunkUrls.length}
        </div>
      )}
    </div>
  );
};

export default ChunkedVideoPlayer;
