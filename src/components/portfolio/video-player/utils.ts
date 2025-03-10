
/**
 * Determine if the URL is a YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  return url.includes('youtube.com/') || 
         url.includes('youtu.be/') || 
         url.includes('youtube-nocookie.com/');
};

// Alias for isYouTubeUrl to maintain backward compatibility
export const isYoutubeUrl = isYouTubeUrl;

/**
 * Extract the YouTube video ID from a YouTube URL
 */
export const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  
  const regexPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/i,
    /youtube\.com\/watch\?.*v=([^&]+)/i,
    /youtube-nocookie\.com\/embed\/([^?&]+)/i
  ];
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return '';
};

// Alias for extractYouTubeId to maintain backward compatibility
export const getYoutubeId = extractYouTubeId;

/**
 * Get file extension from URL
 */
export const getFileExtensionFromUrl = (url: string): string => {
  if (!url) return '';
  
  const filename = url.split('/').pop() || '';
  return filename.includes('.') ? filename.split('.').pop() || '' : '';
};

/**
 * Check if a URL is accessible
 */
export const isUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking URL accessibility:', error);
    return false;
  }
};

/**
 * Get a video thumbnail URL from a video URL
 * For YouTube, get the thumbnail from YouTube's thumbnail service
 * For self-hosted videos, return null
 */
export const getVideoThumbnailUrl = (videoUrl: string): string | null => {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      // Try to get the highest quality thumbnail
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  return null;
};
