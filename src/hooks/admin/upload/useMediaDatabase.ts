
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { createMediaEntry } from '@/utils/upload/media/createEntry';

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
    chunkedUploadId?: string,
    thumbnailUrl?: string
  ) => {
    try {
      // Use the utility function to create the media entry
      const title = file.name.split('.')[0];
      
      const mediaData = {
        title: title,
        file_url: publicUrl,
        type: mediaType,
        thumbnail_url: thumbnailUrl || null,
        video_url: mediaType === 'video' ? publicUrl : undefined,
        orientation: orientation,
        file_size: file.size,
        original_filename: file.name,
        duration: mediaDuration,
        storage_bucket: bucket,
        storage_path: filePath,
        is_chunked: isChunked,
        chunked_upload_id: chunkedUploadId
      };
      
      const data = await createMediaEntry(mediaData);
      
      console.log('Media entry created successfully:', data);
      
      return data;
    } catch (error) {
      console.error('Failed to create media entry:', error);
      throw error;
    }
  };

  return {
    createDatabaseEntry,
    isThumbnailGenerating
  };
};
