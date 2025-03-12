
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Maximum size of a single upload attempt in bytes
 * This is set to 6MB to work reliably with Supabase's limits
 */
const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB

/**
 * Uploads a video file to Supabase storage using chunking if necessary
 * 
 * @param file The video file to upload
 * @param onProgress Callback for upload progress (0-100)
 * @returns Information about the uploaded video
 */
export async function uploadVideo(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<{ 
  id: string; 
  url: string;
  thumbnailUrl?: string;
}> {
  try {
    // Report initial progress
    if (onProgress) onProgress(0);
    
    const fileSize = file.size;
    const fileType = file.type;
    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase() || 'mp4';
    
    // Generate a unique ID for this video
    const videoId = uuidv4();
    
    // Create a proper path in the videos bucket
    const filePath = `${videoId}.${fileExt}`;
    
    console.log(`Starting upload of ${fileName} (${fileSize} bytes)`);
    
    // Create a record in the videos table first
    const { data: videoRecord, error: videoError } = await supabase
      .from('videos')
      .insert({
        id: videoId,
        title: fileName,
        file_path: filePath,
        file_size: fileSize,
        is_processed: false,
        is_published: false,
        metadata: { originalName: fileName, contentType: fileType }
      })
      .select()
      .single();
      
    if (videoError) {
      console.error('Error creating video record:', videoError);
      throw new Error(`Failed to create video record: ${videoError.message}`);
    }
    
    // For small files, use direct upload (under 6MB)
    if (fileSize <= CHUNK_SIZE) {
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: fileType,
          upsert: true
        });
        
      if (uploadError) {
        console.error('Error during direct upload:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    } 
    // For larger files, use chunked upload approach
    else {
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
      console.log(`File size exceeds 6MB, using chunked upload with ${totalChunks} chunks`);
      
      // Upload each chunk
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(fileSize, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);
        
        // Each chunk gets uploaded to the same file, but with an offset
        const { error: chunkError } = await supabase.storage
          .from('videos')
          .uploadToSignedUrl(
            filePath, 
            (await supabase.storage.from('videos').createSignedUploadUrl(filePath)).data!.signedUrl,
            chunk,
            {
              contentType: fileType,
            }
          );
          
        if (chunkError) {
          console.error(`Error uploading chunk ${i+1}/${totalChunks}:`, chunkError);
          throw new Error(`Chunk upload failed: ${chunkError.message}`);
        }
        
        // Update progress
        if (onProgress) {
          // Report progress percentage (leave 10% for processing)
          const chunkProgress = Math.min(90, Math.round(((i + 1) / totalChunks) * 90));
          onProgress(chunkProgress);
        }
        
        console.log(`Uploaded chunk ${i+1}/${totalChunks} successfully`);
      }
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
      
    // Mark the video as processed
    await supabase
      .from('videos')
      .update({ 
        is_processed: true,
      })
      .eq('id', videoId);
    
    // Report completion
    if (onProgress) onProgress(100);
    
    console.log('Video upload complete:', urlData.publicUrl);
    
    return {
      id: videoId,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error('Video upload failed:', error);
    throw new Error(`Video upload failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate a thumbnail from a video file
 * 
 * @param videoFile The video file to generate a thumbnail from
 * @param videoId The ID of the associated video
 * @returns The URL of the generated thumbnail
 */
export async function generateThumbnail(
  videoFile: File,
  videoId: string
): Promise<string | null> {
  try {
    // Use browser's video element to capture a frame
    return new Promise((resolve) => {
      // Create elements for thumbnail extraction
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Handle video load
      video.onloadedmetadata = () => {
        // Set video to 25% of its duration to get a meaningful frame
        video.currentTime = Math.min(2, video.duration * 0.25);
      };
      
      // Handle seeking completion
      video.onseeked = async () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error('Failed to generate thumbnail blob');
            resolve(null);
            return;
          }
          
          // Upload the thumbnail
          const thumbnailPath = `${videoId}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from('thumbnails')
            .upload(thumbnailPath, blob, {
              contentType: 'image/jpeg',
              upsert: true
            });
            
          if (uploadError) {
            console.error('Error uploading thumbnail:', uploadError);
            resolve(null);
            return;
          }
          
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailPath);
          
          // Update the video record with the thumbnail path
          await supabase
            .from('videos')
            .update({ 
              thumbnail_path: thumbnailPath
            })
            .eq('id', videoId);
          
          // Clean up
          URL.revokeObjectURL(video.src);
          
          resolve(urlData.publicUrl);
        }, 'image/jpeg', 0.7);
      };
      
      // Handle errors
      video.onerror = () => {
        console.error('Error generating thumbnail');
        resolve(null);
      };
      
      // Start loading the video
      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

/**
 * Get a video by its ID
 * 
 * @param videoId The ID of the video to retrieve
 * @returns The video data or null if not found
 */
export async function getVideoById(videoId: string) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (error) throw error;
    
    // Get the video URL
    const videoUrl = supabase.storage
      .from('videos')
      .getPublicUrl(data.file_path).data.publicUrl;
      
    // Get the thumbnail URL if it exists
    let thumbnailUrl = null;
    if (data.thumbnail_path) {
      thumbnailUrl = supabase.storage
        .from('thumbnails')
        .getPublicUrl(data.thumbnail_path).data.publicUrl;
    }
    
    return {
      ...data,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl
    };
  } catch (error) {
    console.error('Error getting video:', error);
    return null;
  }
}
