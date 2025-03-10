
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { generateVideoThumbnail } from '@/utils/upload/media/thumbnails';

export const useMediaDatabase = () => {
  const [isThumbnailGenerating, setIsThumbnailGenerating] = useState(false);

  /**
   * Creates a new media entry in the database
   */
  const createDatabaseEntry = async (
    publicUrl: string, 
    file: File, 
    mediaType: 'image' | 'video', 
    contentType: string,
    orientation: string,
    bucket: string,
    filePath: string,
    mediaDuration?: number,
    isChunked?: boolean,
    chunkedUploadId?: string
  ) => {
    try {
      // Generate a slug from the title
      const title = file.name.split('.')[0];
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Prepare the data for insertion
      const newMedia = {
        title: title,
        url: publicUrl,
        type: mediaType,
        thumbnail_url: null,
        video_url: mediaType === 'video' ? publicUrl : undefined,
        slug: `${slug}-${Date.now().toString().substring(9)}`, // Add timestamp suffix to ensure uniqueness
        orientation: orientation,
        is_published: true,
        is_featured: false,
        file_size: file.size,
        file_format: contentType,
        original_filename: file.name,
        tags: mediaType === 'video' ? ['video'] : ['image'],
        duration: mediaDuration,
        sort_order: 0, // Default sort order
        category: mediaType === 'video' ? 'videos' : 'images', // Default category based on type
        storage_bucket: bucket,
        storage_path: filePath,
        // Add metadata for chunked uploads
        metadata: isChunked ? {
          is_chunked: true,
          chunked_upload_id: chunkedUploadId
        } : null
      };
      
      // Insert the media entry into the database
      const { data, error } = await supabase
        .from('media')
        .insert(newMedia)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating media entry:', error);
        throw error;
      }
      
      console.log('Media entry created successfully:', data);
      
      // If it's a chunked video, try to generate a thumbnail asynchronously
      if (isChunked && chunkedUploadId && mediaType === 'video') {
        generateThumbnailForChunkedVideo(data.id, chunkedUploadId);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to create media entry:', error);
      throw error;
    }
  };

  /**
   * Generates a thumbnail for a chunked video asynchronously
   */
  const generateThumbnailForChunkedVideo = async (mediaId: string, chunkedUploadId: string) => {
    try {
      setIsThumbnailGenerating(true);
      console.log('Attempting to generate thumbnail for chunked video:', chunkedUploadId);
      
      // Generate thumbnail (this will be handled server-side in the future)
      const thumbnailUrl = await generateVideoThumbnail(chunkedUploadId);
      
      // If we have a thumbnail URL, update the media entry
      if (thumbnailUrl) {
        const { error } = await supabase
          .from('media')
          .update({ thumbnail_url: thumbnailUrl })
          .eq('id', mediaId);
          
        if (error) {
          console.error('Error updating thumbnail URL:', error);
        } else {
          console.log('Thumbnail generated and updated successfully');
        }
      } else {
        console.log('No thumbnail generated, using default');
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    } finally {
      setIsThumbnailGenerating(false);
    }
  };

  return {
    createDatabaseEntry,
    generateThumbnailForChunkedVideo,
    isThumbnailGenerating
  };
};
