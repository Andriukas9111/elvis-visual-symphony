
/**
 * Extracts YouTube video ID from a YouTube URL (supports regular videos, shorts, and other formats)
 * @param url The YouTube URL
 * @returns The YouTube video ID or null if not a valid YouTube URL
 */
export const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle youtube.com/shorts/ID format
  if (url.includes('youtube.com/shorts/')) {
    const shortsId = url.split('youtube.com/shorts/')[1];
    // Extract the ID before any query parameters
    const cleanId = shortsId.split('?')[0];
    return cleanId || null;
  }
  
  // Handle youtu.be/ID format
  if (url.includes('youtu.be/')) {
    const shortId = url.split('youtu.be/')[1];
    // Extract the ID before any query parameters
    const cleanId = shortId.split('?')[0];
    return cleanId || null;
  }
  
  // Handle regular youtube.com URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Validates if a URL is a valid YouTube URL
 * @param url The URL to check
 * @returns True if it's a valid YouTube URL
 */
export const isYoutubeUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.includes('youtube.com/shorts/')
  );
};

/**
 * Converts any YouTube URL format to an embed URL
 * @param url The YouTube URL
 * @returns YouTube embed URL
 */
export const getYoutubeEmbedUrl = (url: string): string | null => {
  const videoId = getYoutubeId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
};
