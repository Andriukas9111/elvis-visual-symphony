
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize, X, Volume, Volume2, VolumeX, Loader } from 'lucide-react';

export interface VideoPlayerControlsProps {
  playing: boolean;
  loading?: boolean;
  fullscreen?: boolean;
  isYoutubeVideo?: boolean;
  togglePlay: () => void;
  toggleFullscreen?: () => void;
  closeVideo?: () => void;
  skipBackward?: () => void;
  skipForward?: () => void;
  // Add these optional props
  duration?: number;
  currentTime?: number;
  volume?: number;
  muted?: boolean;
  bufferProgress?: number;
  onPlayPause?: () => void;
  onMute?: () => void;
  onVolumeChange?: (value: number) => void;
  onSeek?: (time: number) => void;
  title?: string;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  playing,
  loading = false,
  fullscreen = false,
  isYoutubeVideo = false,
  togglePlay,
  toggleFullscreen,
  closeVideo,
  skipBackward,
  skipForward,
  // Optional props that might be passed
  duration,
  currentTime,
  volume,
  muted,
  bufferProgress,
  onPlayPause,
  onMute,
  onVolumeChange,
  onSeek,
  title
}) => {
  const handlePlayClick = () => {
    if (onPlayPause) {
      onPlayPause();
    } else {
      togglePlay();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex items-center justify-between text-white">
        {/* Play/Pause button */}
        <button 
          onClick={handlePlayClick}
          className="p-2 hover:bg-white/20 rounded-full"
          title={playing ? "Pause" : "Play"}
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : playing ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        
        {/* Volume control - could be enhanced */}
        {onMute && (
          <button 
            onClick={onMute}
            className="p-2 hover:bg-white/20 rounded-full ml-2"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Title if provided */}
        {title && (
          <div className="text-sm truncate mx-4 flex-grow">
            {title}
          </div>
        )}
        
        {/* Fullscreen button */}
        {toggleFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/20 rounded-full ml-auto"
            title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Maximize className="w-5 h-5" />
          </button>
        )}
        
        {/* Close button (optional) */}
        {closeVideo && (
          <button 
            onClick={closeVideo}
            className="p-2 hover:bg-white/20 rounded-full ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerControls;
