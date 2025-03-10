
import React, { useState, useEffect } from 'react';
import BasicVideoPlayer from './BasicVideoPlayer';
import YoutubePlayer from './YoutubePlayer';
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerContainerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  isVertical?: boolean;
  onPlay?: () => void;
  className?: string;
}

const VideoPlayerContainer: React.FC<VideoPlayerContainerProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  isVertical = false,
  onPlay,
  className = ''
}) => {
  const [status, setStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine if it's a YouTube video
  const isYoutubeVideo = videoUrl && (
    videoUrl.includes('youtube.com') || 
    videoUrl.includes('youtu.be') || 
    videoUrl.includes('youtube.com/embed/')
  );
  
  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    
    // Handle youtube.com/watch?v=VIDEO_ID
    const watchRegex = /youtube\.com\/watch\?v=([^&]+)/;
    const watchMatch = url.match(watchRegex);
    if (watchMatch) return watchMatch[1];
    
    // Handle youtu.be/VIDEO_ID
    const shortRegex = /youtu\.be\/([^?&]+)/;
    const shortMatch = url.match(shortRegex);
    if (shortMatch) return shortMatch[1];
    
    // Handle youtube.com/embed/VIDEO_ID
    const embedRegex = /youtube\.com\/embed\/([^?&]+)/;
    const embedMatch = url.match(embedRegex);
    if (embedMatch) return embedMatch[1];
    
    // Handle youtube.com/shorts/VIDEO_ID
    const shortsRegex = /youtube\.com\/shorts\/([^?&]+)/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch) return shortsMatch[1];
    
    return null;
  };
  
  const youtubeId = isYoutubeVideo ? getYoutubeId(videoUrl) : null;
  const isYoutubeShort = isYoutubeVideo && videoUrl.includes('/shorts/');
  
  // Check video URL validity
  useEffect(() => {
    if (!videoUrl) {
      setStatus('error');
      setErrorMessage('No video URL provided');
      return;
    }
    
    // YouTube videos are considered valid by default
    if (isYoutubeVideo) {
      if (!youtubeId) {
        setStatus('error');
        setErrorMessage('Invalid YouTube URL');
      } else {
        setStatus('ready');
      }
      return;
    }
    
    // For self-hosted videos, check if the URL is accessible
    setStatus('checking');
    
    // Use a HEAD request to check if the video exists (this runs on the client)
    if (typeof window !== 'undefined') {
      fetch(videoUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setStatus('ready');
        })
        .catch(err => {
          console.error('Error checking video URL:', videoUrl, err);
          setStatus('error');
          setErrorMessage('Video file not accessible');
        });
    }
  }, [videoUrl, isYoutubeVideo, youtubeId]);
  
  const handleError = (error: string) => {
    console.error('Video player error:', error);
    setStatus('error');
    setErrorMessage(error);
  };

  // Display loading state
  if (status === 'checking') {
    return (
      <div className={`relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-elvis-pink animate-spin mb-2" />
          <p className="text-white/70 text-sm">Checking video source...</p>
        </div>
      </div>
    );
  }
  
  // Display error state
  if (status === 'error') {
    return (
      <div className={`relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center text-center px-4">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-white/70 text-sm">{errorMessage || 'Error loading video'}</p>
        </div>
      </div>
    );
  }
  
  // Render the appropriate player based on the video type
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      {isYoutubeVideo && youtubeId ? (
        <YoutubePlayer 
          videoId={youtubeId}
          title={title || 'YouTube Video'}
          isShort={isYoutubeShort || isVertical}
          onPlay={onPlay}
          className={className}
        />
      ) : (
        <BasicVideoPlayer
          src={videoUrl}
          poster={thumbnailUrl}
          title={title}
          isVertical={isVertical}
          onPlay={onPlay}
          onError={handleError}
          className={className}
        />
      )}
    </div>
  );
};

export default VideoPlayerContainer;
