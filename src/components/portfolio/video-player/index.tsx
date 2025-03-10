
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getYoutubeId } from './utils';
import VideoPlayerControls from './VideoPlayerControls';
import VideoThumbnail from './VideoThumbnail';
import VideoContent from './VideoContent';
import { useVideoPlayer } from './useVideoPlayer';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay,
  hideOverlayText = false
}) => {
  const actualVideoUrl = videoUrl || '';
  const videoId = getYoutubeId(actualVideoUrl);
  
  const {
    playing,
    loading,
    fullscreen,
    error,
    videoRef,
    playerContainerRef,
    isYoutubeVideo,
    isYoutubeShort,
    togglePlay,
    toggleFullscreen,
    closeVideo,
    skipBackward,
    skipForward,
    handleVideoError
  } = useVideoPlayer({ videoUrl: actualVideoUrl, onPlay });
  
  const useVerticalLayout = isVertical || isYoutubeShort;

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${
        useVerticalLayout ? 'aspect-[9/16]' : 'aspect-video'
      } cursor-pointer group bg-elvis-dark`}
      onClick={togglePlay}
      ref={playerContainerRef}
    >
      {!playing ? (
        <VideoThumbnail 
          thumbnail={thumbnail}
          title={title}
          isVertical={useVerticalLayout}
          togglePlay={togglePlay}
          isYoutube={isYoutubeVideo}
          hideTitle={hideOverlayText}
          error={error}
        />
      ) : (
        <AnimatePresence>
          <motion.div 
            className={`absolute inset-0 z-20 ${fullscreen ? 'fixed top-0 left-0 w-screen h-screen' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          >
            <VideoPlayerControls
              playing={playing}
              loading={loading}
              fullscreen={fullscreen}
              isYoutubeVideo={!!videoId}
              togglePlay={togglePlay}
              toggleFullscreen={toggleFullscreen}
              closeVideo={closeVideo}
              skipBackward={skipBackward}
              skipForward={skipForward}
            />
            
            <VideoContent 
              videoId={videoId}
              actualVideoUrl={actualVideoUrl}
              title={title}
              isYoutubeShort={isYoutubeShort}
              videoRef={videoRef}
              handleVideoError={handleVideoError}
            />
            
            {!hideOverlayText && (
              <div className={`absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent ${fullscreen ? 'hidden' : ''}`}>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default VideoPlayer;
