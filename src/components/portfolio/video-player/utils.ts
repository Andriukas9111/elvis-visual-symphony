
export enum VideoErrorType {
  PLAYBACK = 'playback',
  MEDIA = 'media',
  NETWORK = 'network'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  details?: any;
}

export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes('youtube.com/embed/') || 
    url.includes('youtube.com/watch') || 
    url.includes('youtu.be/')
  );
};

export const getEmbedUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  
  // Already an embed URL
  if (videoUrl.includes('youtube.com/embed/')) {
    return videoUrl;
  }
  
  // Convert YouTube watch URL
  if (videoUrl.includes('youtube.com/watch?v=')) {
    const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Convert YouTube short URL
  if (videoUrl.includes('youtu.be/')) {
    const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Not a YouTube URL, return as is
  return videoUrl;
};
