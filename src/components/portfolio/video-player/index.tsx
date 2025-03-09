
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayerControls from './VideoPlayerControls';
import VideoThumbnail from './VideoThumbnail';
import VideoIframe from './VideoIframe';
import VideoElement from './VideoElement';
import { getYoutubeId } from './utils';

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
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  // Use video_url if available, otherwise use url
  const actualVideoUrl = videoUrl || '';
  const isYoutubeVideo = actualVideoUrl.includes('youtube.com') || actualVideoUrl.includes('youtu.be');
  const videoId = isYoutubeVideo ? getYoutubeId(actualVideoUrl) : null;
  
  // For debugging
  useEffect(() => {
    console.log("VideoPlayer props:", { 
      videoUrl, 
      thumbnail, 
      title,
      isYoutubeVideo,
      videoId,
      hideOverlayText,
      playing
    });
  }, [videoUrl, thumbnail, title, isYoutubeVideo, videoId, hideOverlayText, playing]);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset playing state when videoUrl changes
  useEffect(() => {
    setPlaying(false);
  }, [videoUrl]);
  
  const togglePlay = () => {
    // For direct videos
    if (!isYoutubeVideo && videoRef.current && !playing && 'play' in videoRef.current) {
      // Use a timeout to ensure the DOM is updated first
      setTimeout(() => {
        if (videoRef.current && 'play' in videoRef.current) {
          try {
            videoRef.current.play().catch(err => console.error('Error playing video:', err));
          } catch (err) {
            console.error('Error playing video:', err);
          }
        }
      }, 0);
    }
    
    if (playing) {
      setPlaying(false);
    } else {
      if (onPlay) onPlay();
      setPlaying(true);
    }
  };
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (fullscreen) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
    } else if (playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch(err => 
        console.error('Error requesting fullscreen:', err)
      );
    }
  };
  
  const closeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(false);
    if (fullscreen) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
    }
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
        <VideoThumbnail 
          thumbnail={thumbnail}
          title={title}
          isVertical={isVertical}
          togglePlay={togglePlay}
          isYoutube={isYoutubeVideo}
          hideTitle={hideOverlayText}
        />
      ) : (
        <AnimatePresence>
          <motion.div 
            className={`absolute inset-0 z-20 ${fullscreen ? 'fixed top-0 left-0 w-screen h-screen bg-black/95' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VideoPlayerControls
              playing={playing}
              fullscreen={fullscreen}
              isYoutubeVideo={!!videoId}
              togglePlay={togglePlay}
              toggleFullscreen={toggleFullscreen}
              closeVideo={closeVideo}
              skipBackward={skipBackward}
              skipForward={skipForward}
            />
            
            {videoId ? (
              <VideoIframe
                ref={videoRef as React.RefObject<HTMLIFrameElement>}
                videoId={videoId}
                title={title}
              />
            ) : actualVideoUrl ? (
              <VideoElement
                ref={videoRef as React.RefObject<HTMLVideoElement>}
                videoUrl={actualVideoUrl}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker">
                <p className="text-white/70">No video source available</p>
              </div>
            )}
            
            {!hideOverlayText && (
              <div className={`absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent ${fullscreen ? 'hidden' : ''}`}>
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
