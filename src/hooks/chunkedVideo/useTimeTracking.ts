
import { useState, useCallback, RefObject } from 'react';

interface UseTimeTrackingProps {
  videoRef: RefObject<HTMLVideoElement>;
}

export function useTimeTracking({
  videoRef
}: UseTimeTrackingProps) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Time update handler
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [videoRef]);

  // Seek to specific time
  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, [videoRef]);

  // Metadata loaded handler
  const handleMetadataLoaded = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef]);

  return {
    duration,
    currentTime,
    handleTimeUpdate,
    handleSeek,
    handleMetadataLoaded,
    setDuration
  };
}
