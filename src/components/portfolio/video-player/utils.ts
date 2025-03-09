
/**
 * Extracts YouTube video ID from a YouTube URL
 * @param url The YouTube URL
 * @returns The YouTube video ID or null if not a valid YouTube URL
 */
export const getYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
