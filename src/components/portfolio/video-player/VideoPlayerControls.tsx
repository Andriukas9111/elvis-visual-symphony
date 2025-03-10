
import React from 'react';
import { Play, Pause, X, Maximize, Minimize, SkipBack, SkipForward, Loader2 } from 'lucide-react';

interface VideoPlayerControlsProps {
  playing: boolean;
  loading?: boolean;
  fullscreen: boolean;
  isYoutubeVideo: boolean;
  togglePlay: () => void;
  toggleFullscreen: (e: React.MouseEvent) => void;
  closeVideo: (e: React.MouseEvent) => void;
  skipBackward: (e: React.MouseEvent) => void;
  skipForward: (e: React.MouseEvent) => void;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  playing,
  loading = false,
  fullscreen,
  isYoutubeVideo,
  togglePlay,
  toggleFullscreen,
  closeVideo,
  skipBackward,
  skipForward
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* Top controls */}
      <div className="flex justify-end p-4">
        <button 
          onClick={closeVideo} 
          className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Middle controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Skip backward (only for direct videos) */}
        {!isYoutubeVideo && (
          <button 
            onClick={skipBackward}
            className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
          >
            <SkipBack className="w-5 h-5" />
          </button>
        )}
        
        {/* Play/Pause */}
        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="bg-black/50 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : playing ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        
        {/* Skip forward (only for direct videos) */}
        {!isYoutubeVideo && (
          <button 
            onClick={skipForward}
            className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Bottom controls */}
      <div className="flex justify-end p-4">
        <button 
          onClick={toggleFullscreen}
          className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
        >
          {fullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerControls;
