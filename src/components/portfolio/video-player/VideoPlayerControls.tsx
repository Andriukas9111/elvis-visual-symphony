
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerControlsProps {
  playing: boolean;
  fullscreen: boolean;
  isYoutubeVideo: boolean;
  togglePlay: (e: React.MouseEvent) => void;
  toggleFullscreen: (e: React.MouseEvent) => void;
  closeVideo: (e: React.MouseEvent) => void;
  skipBackward: (e: React.MouseEvent) => void;
  skipForward: (e: React.MouseEvent) => void;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  playing,
  fullscreen,
  isYoutubeVideo,
  togglePlay,
  toggleFullscreen,
  closeVideo,
  skipBackward,
  skipForward
}) => {
  return (
    <>
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
      
      {!isYoutubeVideo && (
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
    </>
  );
};

export default VideoPlayerControls;
