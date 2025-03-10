
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../utils';

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
  hideOverlayText?: boolean;
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
  hideOverlayText = true,
  handlePlayPause,
  handleVolumeChange,
  handleMuteToggle,
  handleSeek
}) => {
  const [showHoverControls, setShowHoverControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Show controls when paused or when hovering
  const shouldShowControls = isPaused || showHoverControls || isDragging;
  
  // Hide controls automatically after a delay
  useEffect(() => {
    if (!isPaused && showHoverControls && !isDragging) {
      const timer = setTimeout(() => {
        setShowHoverControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isPaused, showHoverControls, isDragging]);
  
  // Event handlers for mouse over/out
  const handleMouseEnter = () => setShowHoverControls(true);
  const handleMouseLeave = () => !isDragging && setShowHoverControls(false);
  
  // Handle click on the progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    handleSeek(duration * clickPosition);
  };
  
  // Handle drag start and end on the progress bar thumb
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  
  return (
    <>
      {/* Playback overlay when paused */}
      {isPaused && (
        <div 
          className="absolute inset-0 bg-elvis-darker/50 z-10 flex items-center justify-center" 
          onClick={handlePlayPause}
          style={{ willChange: 'opacity' }}
        >
          <motion.div 
            className="bg-elvis-pink/80 p-4 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Play className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      )}
      
      {/* Buffering overlay */}
      {isBuffering && !isPaused && (
        <div className="absolute inset-0 bg-elvis-darker/50 z-10 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-elvis-pink" />
          </motion.div>
        </div>
      )}
      
      {/* Interactive overlay for mouse events */}
      <div 
        className="absolute inset-0 z-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={!shouldShowControls ? handlePlayPause : undefined}
      >
        {/* Controls overlay - shown when paused or hovered */}
        {showControls && (
          <AnimatePresence>
            {shouldShowControls && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 px-4 py-3 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Progress bar */}
                <div 
                  className="w-full h-1 bg-white/30 rounded-full mb-3 relative cursor-pointer"
                  onClick={handleProgressClick}
                >
                  {/* Played progress */}
                  <div 
                    className="h-full bg-elvis-pink rounded-full absolute top-0 left-0"
                    style={{ 
                      width: `${(currentTime / duration) * 100}%`,
                      willChange: 'width' 
                    }}
                  />
                  
                  {/* Progress thumb */}
                  <motion.div 
                    className="h-3 w-3 bg-elvis-pink rounded-full absolute top-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${(currentTime / duration) * 100}%`,
                      willChange: 'transform, left' 
                    }}
                    whileHover={{ scale: 1.5 }}
                    whileDrag={{ scale: 1.5 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                </div>
                
                {/* Controls row */}
                <div className="flex items-center justify-between">
                  {/* Left controls */}
                  <div className="flex items-center space-x-3">
                    {/* Play/Pause button */}
                    <button 
                      className="p-1 rounded-full hover:bg-white/10"
                      onClick={handlePlayPause}
                    >
                      {isPaused ? (
                        <Play className="h-5 w-5 text-white" />
                      ) : (
                        <Pause className="h-5 w-5 text-white" />
                      )}
                    </button>
                    
                    {/* Volume control */}
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 rounded-full hover:bg-white/10"
                        onClick={handleMuteToggle}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-5 w-5 text-white" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-white" />
                        )}
                      </button>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 accent-elvis-pink"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default VideoOverlay;
