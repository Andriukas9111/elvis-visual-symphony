
export enum VideoErrorType {
  NETWORK = 'NETWORK',
  FORMAT = 'FORMAT',
  MEDIA = 'MEDIA',
  UNKNOWN = 'UNKNOWN',
  PLAYBACK = 'PLAYBACK',
  ACCESS = 'ACCESS'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  details?: any;
  code?: number;
  timestamp?: number;
}

export function isYouTubeUrl(url: string): boolean {
  return url && (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.startsWith('youtube:')
  );
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  
  if (url.startsWith('youtube:')) {
    return url.replace('youtube:', '');
  }

  // Handle youtu.be URLs
  if (url.includes('youtu.be')) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  }
  
  // Handle youtube.com URLs
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export function isYouTubeShort(url: string): boolean {
  const shortPattern = /youtube\.com\/shorts\//i;
  return shortPattern.test(url);
}
