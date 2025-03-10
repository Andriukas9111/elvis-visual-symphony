
import React, { useEffect, useState } from 'react';
import { getYoutubeId } from '../video-player/utils';

interface YouTubePlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  loop?: boolean;
  startAt?: number;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            rel?: 0 | 1;
            showinfo?: 0 | 1;
            loop?: 0 | 1;
            mute?: 0 | 1;
            playsinline?: 0 | 1;
            start?: number;
            modestbranding?: 0 | 1;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => void;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  isPlaying,
  setIsPlaying,
  volume,
  isMuted,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  loop = false,
  startAt,
  onError
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [isYTApiLoaded, setIsYTApiLoaded] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const containerId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;
  
  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      window.onYouTubeIframeAPIReady = () => {
        setIsYTApiLoaded(true);
      };
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else {
      setIsYTApiLoaded(true);
    }
    
    // Extract video ID from URL
    const extractedId = getYoutubeId(videoUrl);
    setVideoId(extractedId);
    
    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (e) {
          console.error('Error destroying YouTube player:', e);
        }
      }
    };
  }, [videoUrl]);
  
  // Initialize player when API is loaded
  useEffect(() => {
    if (isYTApiLoaded && videoId && !player && window.YT?.Player) {
      const startTime = startAt || 0;
      
      const newPlayer = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          showinfo: 0,
          loop: loop ? 1 : 0,
          mute: isMuted ? 1 : 0,
          playsinline: 1,
          start: startTime,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            console.log('YouTube player ready');
            event.target.setVolume(volume * 100);
            if (isPlaying) {
              event.target.playVideo();
            }
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            // Update play state
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (loop) {
                event.target.playVideo();
              }
            }
            
            // Update duration when it's available
            if (event.data !== window.YT.PlayerState.UNSTARTED) {
              setDuration(event.target.getDuration());
            }
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
            let errorMessage = 'An error occurred with the YouTube player';
            
            // YouTube player error codes
            switch (event.data) {
              case 2:
                errorMessage = 'Invalid YouTube video ID';
                break;
              case 5:
                errorMessage = 'HTML5 player error';
                break;
              case 100:
                errorMessage = 'Video not found or removed';
                break;
              case 101:
              case 150:
                errorMessage = 'Video cannot be played in embedded players';
                break;
            }
            
            if (onError) {
              onError({
                message: errorMessage,
                code: event.data,
                details: 'YouTube player error'
              });
            }
          }
        }
      });
      
      setPlayer(newPlayer);
    }
  }, [isYTApiLoaded, videoId, volume, isMuted, loop, startAt, isPlaying, setIsPlaying, setDuration, onError]);
  
  // Update current time periodically
  useEffect(() => {
    if (!player) return;
    
    const timeUpdateInterval = setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function') {
        setCurrentTime(player.getCurrentTime());
      }
    }, 250);
    
    return () => clearInterval(timeUpdateInterval);
  }, [player, setCurrentTime]);
  
  // Sync play state with player
  useEffect(() => {
    if (!player) return;
    
    try {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    } catch (e) {
      console.error('Error controlling YouTube player:', e);
    }
  }, [isPlaying, player]);
  
  // Sync volume with player
  useEffect(() => {
    if (!player) return;
    
    try {
      player.setVolume(volume * 100);
    } catch (e) {
      console.error('Error setting YouTube volume:', e);
    }
  }, [volume, player]);
  
  // Sync mute state with player
  useEffect(() => {
    if (!player) return;
    
    try {
      if (isMuted) {
        player.mute();
      } else {
        player.unMute();
      }
    } catch (e) {
      console.error('Error setting YouTube mute state:', e);
    }
  }, [isMuted, player]);
  
  // Sync current time from external controls
  useEffect(() => {
    if (!player) return;
    
    try {
      // Only seek if difference is significant to avoid loops
      const playerTime = player.getCurrentTime();
      if (Math.abs(playerTime - currentTime) > 0.5) {
        player.seekTo(currentTime, true);
      }
    } catch (e) {
      console.error('Error seeking YouTube video:', e);
    }
  }, [currentTime, player]);
  
  return (
    <div className="w-full h-full">
      {/* Show thumbnail until player is ready */}
      {!player && thumbnail && (
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${thumbnail})` }} 
        />
      )}
      <div id={containerId} className="w-full h-full" />
    </div>
  );
};
