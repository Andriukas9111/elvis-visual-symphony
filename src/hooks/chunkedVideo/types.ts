
import { VideoErrorData } from '@/components/portfolio/video-player/utils';

export type VideoStatus = 'loading' | 'buffering' | 'ready' | 'error';

export interface ChunkedVideoState {
  status: VideoStatus;
  errorMessage: string;
  chunkData: any;
  chunkUrls: string[];
  currentChunk: number;
  isPaused: boolean;
  volume: number;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  loadingProgress: number;
  isBuffering: boolean;
}

export interface UseChunkedVideoProps {
  videoId: string;
  onError?: (error: VideoErrorData) => void;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  initialVolume?: number;
  onPlay?: () => void;
}

export interface UseChunkedVideoResult extends ChunkedVideoState {
  videoRef: React.RefObject<HTMLVideoElement>;
  nextChunkRef: React.RefObject<HTMLVideoElement>;
  handlePlayPause: () => void;
  handleVolumeChange: (value: number) => void;
  handleMuteToggle: () => void;
  handleTimeUpdate: () => void;
  handleSeek: (time: number) => void;
  handleMetadataLoaded: () => void;
  handleChunkEnded: () => void;
  handleVideoError: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  handleWaiting: () => void;
  handleCanPlay: () => void;
}
