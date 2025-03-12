
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates thumbnails from a video file
 * @param file The video file to generate thumbnails from
 * @param numberOfThumbnails Number of thumbnails to generate (default: 5)
 * @returns Promise with an array of thumbnail Blob objects and their timestamps
 */
export const generateThumbnailsFromVideo = async (
  file: File,
  numberOfThumbnails = 5
): Promise<Array<{ blob: Blob; timestamp: number; isVertical: boolean }>> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a URL for the video file
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      
      // Set up video element
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.preload = 'metadata';

      const thumbnails: Array<{ blob: Blob; timestamp: number; isVertical: boolean }> = [];
      
      // Handle metadata loaded to know video duration and dimensions
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const isVertical = video.videoHeight > video.videoWidth;
        
        console.log(`Video duration: ${duration} seconds, dimensions: ${video.videoWidth}×${video.videoHeight}, isVertical: ${isVertical}`);
        
        // Calculate thumbnail timestamps evenly distributed across the video
        const timestamps = [];
        for (let i = 1; i <= numberOfThumbnails; i++) {
          timestamps.push(duration * (i / (numberOfThumbnails + 1)));
        }
        
        let thumbnailsGenerated = 0;
        
        // Generate each thumbnail
        timestamps.forEach((timestamp, index) => {
          // Set video to the timestamp
          video.currentTime = timestamp;
          
          // Handle when the video is seeked to the timestamp
          video.onseeked = () => {
            // Create canvas to capture the frame
            const canvas = document.createElement('canvas');
            
            // Set thumbnail dimensions based on video orientation
            if (isVertical) {
              // Portrait/vertical video - maintain aspect ratio
              const aspectRatio = video.videoHeight / video.videoWidth;
              canvas.width = 720;
              canvas.height = Math.round(canvas.width * aspectRatio);
            } else {
              // Landscape/horizontal video - standard 16:9
              canvas.width = 1280;
              canvas.height = 720;
            }
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Draw the video frame on the canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Convert the canvas to a blob
              canvas.toBlob((blob) => {
                if (blob) {
                  thumbnails.push({ blob, timestamp, isVertical });
                  thumbnailsGenerated++;
                  
                  // If we've generated all thumbnails, resolve the promise
                  if (thumbnailsGenerated === numberOfThumbnails) {
                    // Clean up
                    URL.revokeObjectURL(videoUrl);
                    resolve(thumbnails);
                  }
                } else {
                  console.error(`Failed to create blob for thumbnail ${index}`);
                }
              }, 'image/jpeg', 0.85); // Use JPEG format with 85% quality
            }
          };
        });
      };
      
      video.onerror = (e) => {
        console.error('Error during video loading for thumbnail generation:', e);
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Failed to load video for thumbnail generation'));
      };
      
      // Load the video
      video.load();
      
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(videoUrl);
        if (thumbnails.length > 0) {
          console.warn('Thumbnail generation timed out, returning partial results');
          resolve(thumbnails);
        } else {
          reject(new Error('Thumbnail generation timed out'));
        }
      }, 30000); // 30 second timeout
      
      // Clear timeout when video errors or completes
      video.onended = video.onerror = () => {
        clearTimeout(timeout);
      };
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      reject(error);
    }
  });
};
