import React, { useState, useCallback } from 'react';
import VideoThumbnail from './VideoThumbnail';
import VideoContent from './VideoContent';
import VideoElement from './VideoElement';
import VideoPlayerControls from './VideoPlayerControls';
import { createVideoErrorData } from './utils';

interface SelfHostedPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  fileSize?: number;
  onError?: (error: any) => void;
  controls?: boolean;
  muted?: boolean;
  initialVolume?: number;
}

const SelfHostedPlayer: React.FC<SelfHostedPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  isVertical = false,
  onPlay,
  hideOverlayText = false,
  loop = false,
  autoPlay = false,
  preload = 'metadata',
  fileSize,
  onError,
  controls = true,
  muted = false,
  initialVolume = 0.7,
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [useCustomControls, setUseCustomControls] = useState(controls && process.env.NODE_ENV !== 'test');
  const [showThumbnail, setShowThumbnail] = useState(!autoPlay);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(muted);
  const [bufferProgress, setBufferProgress] = useState(0);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    setShowThumbnail(false);
    if (onPlay) onPlay();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setPlaying(false);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number, newMuted: boolean) => {
    setVolume(newVolume);
    setIsMuted(newMuted);
  }, []);

  const handleTimeUpdate = useCallback((time: number, duration: number) => {
    setCurrentTime(time);
    if (duration > 0 && videoDuration !== duration) {
      setVideoDuration(duration);
    }
  }, [videoDuration]);

  const handleError = useCallback((event: Event) => {
    if (onError) {
      const errorData = createVideoErrorData(event);
      onError(errorData);
    }
  }, [onError]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
      {showThumbnail && thumbnail && (
        <VideoThumbnail
          thumbnail={thumbnail}
          title={title}
          isVertical={isVertical}
          togglePlay={handlePlay}
          hideTitle={hideOverlayText}
        />
      )}

      <VideoContent isVisible={!showThumbnail || !thumbnail} togglePlay={handlePlay}>
        <div className="absolute inset-0 bg-black">
          <VideoElement
            src={videoUrl}
            poster={thumbnail}
            autoPlay={autoPlay}
            loop={loop}
            controls={!useCustomControls}
            preload={preload}
            fileSize={fileSize}
            className="w-full h-full object-contain"
            onPlay={handlePlay}
            onPause={handlePause}
            onError={handleError}
            onProgress={(percent) => setBufferProgress(percent)}
            onTimeUpdate={handleTimeUpdate}
            onVolumeChange={handleVolumeChange}
            muted={isMuted}
            initialVolume={initialVolume}
          />
        </div>

        {useCustomControls && !showThumbnail && (
          <VideoPlayerControls
            playing={playing}
            loading={false}
            fullscreen={false}
            isYoutubeVideo={false}
            togglePlay={() => setPlaying(!playing)}
            toggleFullscreen={() => {}}
            closeVideo={() => {}}
            skipBackward={() => {}}
            skipForward={() => {}}
          />
        )}
      </VideoContent>
    </div>
  );
};

export default SelfHostedPlayer;
