import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, Loader2 } from 'lucide-react';
import BufferOverlay from './BufferOverlay';
import { isYoutubeUrl, getYoutubeId } from './utils';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  isVertical?: boolean;
  hideOverlayText?: boolean;
  onPlay?: () => void;
  onError?: (error: { type: string; message: string }) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  autoPlay = false,
  loop = false,
  isVertical = false,
  hideOverlayText = false,
  onPlay,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [isMuted, playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlayPause = () => {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
        if (onPlay) {
          onPlay();
        }
      }
    };

    const handleMetadataLoaded = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleError = (event: any) => {
      console.error('Video error:', event);
      setIsLoading(false);
      setIsBuffering(false);
      if (onError) {
        onError({ type: 'VIDEO_ERROR', message: 'Video playback failed.' });
      }
    };

    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [isPlaying, onPlay, onError]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        if (onPlay) {
          onPlay();
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!isFullScreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).mozRequestFullScreen) {
          (videoRef.current as any).mozRequestFullScreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen();
        } else if ((videoRef.current as any).msRequestFullscreen) {
          (videoRef.current as any).msRequestFullscreen();
        }
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        setIsFullScreen(false);
      }
    }
  };

  const handleTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlaybackRate = () => {
    setPlaybackRate(prevRate => {
      const newRate = prevRate === 1 ? 2 : 1;
      if (videoRef.current) {
        videoRef.current.playbackRate = newRate;
      }
      return newRate;
    });
  };

  const renderVideoContent = () => {
    if (isYoutubeUrl(videoUrl || '')) {
      const youtubeId = getYoutubeId(videoUrl || '');
      if (youtubeId) {
        return (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      } else {
        return <p>Invalid YouTube URL</p>;
      }
    } else {
      return (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail}
          autoPlay={autoPlay}
          loop={loop}
          playsInline
          className="w-full h-full object-cover"
        />
      );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl aspect-video bg-elvis-darker ${isVertical ? 'w-full' : 'w-full'}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isLoading && <BufferOverlay />}
      {isBuffering && <BufferOverlay />}

      {renderVideoContent()}

      {!hideOverlayText && title && (
        <div className="absolute bottom-0 left-0 p-4 text-white text-shadow-md">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}

      {(showControls || isFullScreen) && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-elvis-dark/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300">
          <div className="flex items-center space-x-2">
            <button onClick={togglePlayPause} className="text-white hover:text-elvis-pink focus:outline-none">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <button onClick={toggleMute} className="text-white hover:text-elvis-pink focus:outline-none">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeSliderChange}
              className="w-16 md:w-24"
            />

            <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={handlePlaybackRate} className="text-white hover:text-elvis-pink focus:outline-none">
              <RotateCcw className="h-5 w-5" />
            </button>

            <button onClick={toggleFullScreen} className="text-white hover:text-elvis-pink focus:outline-none">
              {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {(showControls || isFullScreen) && (
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleTimeSliderChange}
          className="absolute bottom-0 left-0 w-full h-2 bg-transparent cursor-pointer"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
