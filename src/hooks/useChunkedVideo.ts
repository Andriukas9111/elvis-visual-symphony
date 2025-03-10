
import { useState, useEffect, useRef } from 'react';
import { getChunkedVideo, getChunkUrls } from '@/utils/upload/mediaDatabase';
import { VideoErrorData, VideoErrorType, logVideoError } from '@/components/portfolio/video-player/utils';

interface UseChunkedVideoProps {
  videoId: string;
  onError?: (error: VideoErrorData) => void;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  initialVolume?: number;
  onPlay?: () => void;
}

export const useChunkedVideo = ({
  videoId,
  onError,
  autoPlay = false,
  muted = false,
  loop = false,
  initialVolume = 0.7,
  onPlay
}: UseChunkedVideoProps) => {
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
  
  // Effect for handling autoplay
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

  // Effect for handling chunk changes
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

  return {
    videoRef,
    status,
    errorMessage,
    chunkData,
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
    handleCanPlay
  };
};
