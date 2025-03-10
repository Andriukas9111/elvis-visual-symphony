
import { supabase } from '@/lib/supabase';

/**
 * Generates thumbnails from a video file
 * @param file The video file to generate thumbnails from
 * @param numberOfThumbnails Number of thumbnails to generate (default: 3)
 * @returns Promise with an array of thumbnail Blob objects and their timestamps
 */
export const generateThumbnailsFromVideo = async (
  file: File,
  numberOfThumbnails = 3
): Promise<Array<{ blob: Blob; timestamp: number }>> => {
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

      const thumbnails: Array<{ blob: Blob; timestamp: number }> = [];
      
      // Handle metadata loaded to know video duration
      video.onloadedmetadata = () => {
        const duration = video.duration;
        console.log(`Video duration: ${duration} seconds`);
        
        // Calculate thumbnail timestamps at 25%, 50%, and 75% of the video
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
            canvas.width = 1280;  // 720p thumbnail width
            canvas.height = 720;  // 720p thumbnail height
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Draw the video frame on the canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Convert the canvas to a blob
              canvas.toBlob((blob) => {
                if (blob) {
                  thumbnails.push({ blob, timestamp });
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
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      reject(error);
    }
  });
};

/**
 * Uploads thumbnails to storage and returns their URLs
 * @param thumbnails Array of thumbnail blobs and timestamps
 * @param videoFileName Original video filename for reference
 * @returns Promise with array of thumbnail URLs and their timestamps
 */
export const uploadThumbnails = async (
  thumbnails: Array<{ blob: Blob; timestamp: number }>,
  videoFileName: string
): Promise<Array<{ url: string; timestamp: number }>> => {
  const uploadPromises = thumbnails.map(async ({ blob, timestamp }, index) => {
    // Create a file from the blob
    const fileExt = 'jpg';
    const fileName = `${videoFileName.split('.')[0]}_thumb_${index + 1}.${fileExt}`;
    const filePath = `thumbnails/${Date.now()}_${fileName}`;
    const thumbnailFile = new File([blob], fileName, { type: 'image/jpeg' });
    
    try {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);
      
      return { url: urlData.publicUrl, timestamp };
    } catch (error) {
      console.error(`Error uploading thumbnail ${index + 1}:`, error);
      throw error;
    }
  });
  
  return Promise.all(uploadPromises);
};

/**
 * Updates the media entry with the selected thumbnail URL
 * @param mediaId ID of the media entry to update
 * @param thumbnailUrl URL of the selected thumbnail
 * @returns Promise resolving to true if successful
 */
export const updateMediaThumbnail = async (
  mediaId: string,
  thumbnailUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('media')
      .update({ thumbnail_url: thumbnailUrl })
      .eq('id', mediaId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating media thumbnail:', error);
    return false;
  }
};
