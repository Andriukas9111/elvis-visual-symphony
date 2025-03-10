
import { useState, useCallback, RefObject, useEffect } from 'react';

interface UseVolumeControlProps {
  videoRef: RefObject<HTMLVideoElement>;
  initialVolume: number;
  muted: boolean;
}

export function useVolumeControl({
  videoRef,
  initialVolume,
  muted
}: UseVolumeControlProps) {
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(muted);

  // Volume control
  const handleVolumeChange = useCallback((value: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, value));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, [videoRef]);

  // Mute toggle
  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted, videoRef]);

  // Sync muted state with prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      setIsMuted(muted);
    }
  }, [muted, videoRef]);

  // Sync volume with prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = initialVolume;
      setVolume(initialVolume);
    }
  }, [initialVolume, videoRef]);

  return {
    volume,
    isMuted,
    handleVolumeChange,
    handleMuteToggle
  };
}
