
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize, X, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerControlsProps {
  playing: boolean;
  togglePlay: () => void;
  fullscreen: boolean;
  toggleFullscreen: () => void;
  skipBackward: () => void;
  skipForward: () => void;
  closeVideo?: () => void;
  duration: number;
  currentTime: number;
  muted: boolean;
  toggleMute?: () => void;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  playing,
  togglePlay,
  fullscreen,
  toggleFullscreen,
  skipBackward,
  skipForward,
  closeVideo,
  duration,
  currentTime,
  muted,
  toggleMute
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button 
            onClick={togglePlay}
            className="text-white hover:text-elvis-pink transition"
          >
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            onClick={skipBackward}
            className="text-white hover:text-elvis-pink transition"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={skipForward}
            className="text-white hover:text-elvis-pink transition"
          >
            <SkipForward size={20} />
          </button>
          
          {toggleMute && (
            <button 
              onClick={toggleMute}
              className="text-white hover:text-elvis-pink transition"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
          
          <div className="text-white text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleFullscreen}
            className="text-white hover:text-elvis-pink transition"
          >
            {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
          
          {closeVideo && (
            <button 
              onClick={closeVideo}
              className="text-white hover:text-elvis-pink transition"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
        <div 
          className="bg-elvis-pink h-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default VideoPlayerControls;
