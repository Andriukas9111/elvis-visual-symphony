
import React, { useState, useRef } from 'react';
import { Play, X, Maximize, Minimize, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay 
}) => {
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  // Extract YouTube video ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const videoId = getYoutubeId(videoUrl);
  
  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      // Call onPlay prop to inform parent that this video is playing
      if (onPlay) onPlay();
      setPlaying(true);
    }
  };
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (fullscreen) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
      setFullscreen(false);
    } else if (playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch(err => 
        console.error('Error requesting fullscreen:', err)
      );
      setFullscreen(true);
    }
  };
  
  const closeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(false);
    setFullscreen(false);
  };
  
  const skipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && 'currentTime' in videoRef.current) {
      (videoRef.current as HTMLVideoElement).currentTime -= 10;
    }
  };
  
  const skipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && 'currentTime' in videoRef.current) {
      (videoRef.current as HTMLVideoElement).currentTime += 10;
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${
        isVertical ? 'aspect-[9/16]' : 'aspect-video'
      } cursor-pointer group`}
      onClick={togglePlay}
      ref={playerContainerRef}
    >
      {!playing ? (
        <>
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-elvis-pink/80 backdrop-blur-md flex items-center justify-center"
            >
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-bold text-white drop-shadow-md">{title}</h3>
          </div>
        </>
      ) : (
        <AnimatePresence>
          <motion.div 
            className={`absolute inset-0 z-20 ${fullscreen ? 'fixed top-0 left-0 w-screen h-screen bg-black/95' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-4 right-4 z-30 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
                onClick={toggleFullscreen}
              >
                {fullscreen ? 
                  <Minimize className="h-5 w-5 text-white" /> : 
                  <Maximize className="h-5 w-5 text-white" />
                }
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
                onClick={closeVideo}
              >
                <X className="h-5 w-5 text-white" />
              </motion.button>
            </div>
            
            {/* Video controls for HTML5 videos */}
            {!videoId && (
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-4 px-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-5 w-5 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
                  onClick={togglePlay}
                >
                  {playing ? 
                    <Pause className="h-5 w-5 text-white" /> : 
                    <Play className="h-5 w-5 text-white" />
                  }
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-elvis-darker/80 backdrop-blur-md p-2 rounded-full"
                  onClick={skipForward}
                >
                  <SkipForward className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            )}
            
            {videoId ? (
              <iframe
                ref={videoRef as React.RefObject<HTMLIFrameElement>}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&fs=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                ref={videoRef as React.RefObject<HTMLVideoElement>}
                className="absolute inset-0 w-full h-full object-cover"
                src={videoUrl}
                autoPlay
                controls
                playsInline
              />
            )}
            
            {/* Title overlay at the bottom */}
            <div className={`absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent ${fullscreen ? 'hidden' : ''}`}>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Orientation badge */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm">
        {isVertical ? 'Vertical' : 'Horizontal'}
      </div>
    </div>
  );
};

export default VideoPlayer;
