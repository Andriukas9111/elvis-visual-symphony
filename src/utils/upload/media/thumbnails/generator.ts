
/**
 * Functions for generating video thumbnails from video files
 */

/**
 * Generates thumbnails from a video file
 * @param videoFile The video file to generate thumbnails from
 * @returns Promise with array of thumbnail blobs and their timestamps
 */
export const generateThumbnailsFromVideo = async (
  videoFile: File
): Promise<Array<{ blob: Blob; timestamp: number; isVertical: boolean }>> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a video element to extract frames
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      
      // Wait for video metadata to load
      video.onloadedmetadata = () => {
        const thumbnails: Array<{ blob: Blob; timestamp: number; isVertical: boolean }> = [];
        const duration = video.duration;
        const isVertical = video.videoHeight > video.videoWidth;
        
        // Choose 4 evenly spaced timestamps to capture frames
        const timestamps = [
          Math.max(1, duration * 0.1),
          duration * 0.33,
          duration * 0.5,
          Math.min(duration - 1, duration * 0.75)
        ];
        
        // Count of thumbnails successfully generated
        let capturedCount = 0;
        
        // Process each timestamp
        timestamps.forEach(timestamp => {
          // Seek to the timestamp
          video.currentTime = timestamp;
          
          // Once seeked, capture the frame
          video.onseeked = async function() {
            try {
              // Create canvas with video dimensions
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              
              // Draw the video frame to the canvas
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convert canvas to blob
                canvas.toBlob(blob => {
                  if (blob) {
                    thumbnails.push({
                      blob,
                      timestamp,
                      isVertical
                    });
                    
                    capturedCount++;
                    
                    // After capturing all thumbnails, resolve the promise
                    if (capturedCount === timestamps.length) {
                      // Clean up
                      URL.revokeObjectURL(video.src);
                      resolve(thumbnails);
                    }
                  }
                }, 'image/jpeg', 0.8);
              }
              
              // Set onseeked to null to avoid capturing the same timestamp again
              video.onseeked = null;
            } catch (error) {
              console.error('Error capturing frame:', error);
              reject(error);
            }
          };
        });
      };
      
      // Handle video loading errors
      video.onerror = (error) => {
        console.error('Error loading video:', error);
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video for thumbnails'));
      };
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      reject(error);
    }
  });
};
