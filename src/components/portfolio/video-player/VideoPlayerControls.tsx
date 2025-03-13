
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export interface VideoPlayerControlsProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean; // This is the correct property name in our interface
  currentTime: number;
  duration: number;
  volume?: number;
  isMuted?: boolean;
  togglePlay: () => void;
  onVolumeChange?: (value: number) => void;
  onMuteToggle?: () => void;
  onSeek?: (time: number) => void;
  onFullscreen?: () => void;
  // Additional props that are actually being used in some components
  loading?: boolean;
  bufferProgress?: number;
  onPlayPause?: () => void;
  onMute?: () => void;
  title?: string;
  fullscreen?: boolean;
  toggleFullscreen?: () => void;
  skipBackward?: () => void;
  skipForward?: () => void;
  closeVideo?: () => void;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume = 0.7,
  isMuted = false,
  togglePlay,
  onVolumeChange,
  onMuteToggle,
  onSeek,
  onFullscreen
}) => {
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeChange = (value: number[]) => {
    if (onSeek) onSeek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (onVolumeChange) onVolumeChange(value[0]);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* Progress bar */}
      <div className="mb-2">
        <Slider
          defaultValue={[0]}
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleTimeChange}
          className="h-1"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Play/Pause button */}
          <button 
            onClick={togglePlay} 
            className="text-white p-1 rounded-full hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>
          
          {/* Time display */}
          <div className="text-white text-xs">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Volume control */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={onMuteToggle} 
              className="text-white p-1 rounded-full hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            
            <div className="w-16 hidden sm:block">
              <Slider
                defaultValue={[0.7]}
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="h-1"
              />
            </div>
          </div>
          
          {/* Fullscreen button */}
          <button 
            onClick={onFullscreen}
            className="text-white p-1 rounded-full hover:bg-white/20"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerControls;
