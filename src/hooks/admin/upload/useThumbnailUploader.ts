
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useThumbnailState } from './useThumbnailState';

/**
 * Hook for thumbnail upload functionality
 */
export const useThumbnailUploader = () => {
  const { 
    setThumbnails, 
    setIsGenerating, 
    selectThumbnail, 
    toast 
  } = useThumbnailState();

  /**
   * Retry a Supabase operation with exponential backoff
   */
  const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
  ): Promise<T> => {
    let retries = 0;
    let lastError: any;

    while (retries < maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Only retry on timeout errors
        if (error.code === 'DatabaseTimeout' || error.statusCode === '544') {
          retries++;
          const delay = initialDelay * Math.pow(2, retries - 1);
          console.log(`Database operation timed out, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // For non-timeout errors, don't retry
          throw error;
        }
      }
    }
    
    // If we've exhausted retries, throw the last error
    console.error(`Failed after ${maxRetries} retries:`, lastError);
    throw lastError;
  };

  /**
   * Upload a custom thumbnail
   */
  const uploadCustomThumbnail = async (file: File): Promise<string | null> => {
    if (!file || !file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please provide a valid image file as thumbnail.',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsGenerating(true);
    try {
      // Detect if the image is vertical by loading it
      const isVertical = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(img.height > img.width);
        };
        img.onerror = () => {
          resolve(false); // Default to horizontal if we can't determine
        };
        img.src = URL.createObjectURL(file);
      });
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `custom_thumb_${uuidv4()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;
      
      // Upload the file to Supabase Storage with retry logic
      const uploadWithRetry = async () => {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type
          });

        if (uploadError) throw uploadError;
        return uploadData;
      };
      
      // Retry the upload operation if it fails
      await retryOperation(uploadWithRetry);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      // Add to thumbnails and select it
      const thumbnailUrl = urlData.publicUrl;
      setThumbnails(prev => [...prev, { url: thumbnailUrl, timestamp: 0, isVertical }]);
      selectThumbnail(thumbnailUrl, isVertical);
      
      toast({
        title: 'Custom thumbnail uploaded',
        description: `Your custom ${isVertical ? 'vertical' : 'horizontal'} thumbnail has been uploaded and selected.`,
      });
      
      return thumbnailUrl;
    } catch (error) {
      console.error('Error uploading custom thumbnail:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (typeof error === 'object' && error !== null && 'message' in error)
          ? (error as any).message
          : 'Failed to upload custom thumbnail';
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Save the selected thumbnail to the media entry
   */
  const saveThumbnail = async (
    mediaId: string, 
    selectedThumbnail: string | null, 
    selectedThumbnailIsVertical: boolean
  ): Promise<boolean> => {
    if (!selectedThumbnail) {
      toast({
        title: 'No thumbnail selected',
        description: 'Please select a thumbnail first.',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      // Save with retry logic
      const saveWithRetry = async () => {
        const { error } = await supabase
          .from('media')
          .update({ 
            thumbnail_url: selectedThumbnail,
            orientation: selectedThumbnailIsVertical ? 'vertical' : 'horizontal',
            updated_at: new Date().toISOString()
          })
          .eq('id', mediaId);
        
        if (error) throw error;
        return true;
      };
      
      await retryOperation(saveWithRetry);
      
      // Log the update for tracking purposes
      console.log(`Updated thumbnail for media ${mediaId}. Orientation: ${selectedThumbnailIsVertical ? 'vertical' : 'horizontal'}`);
      
      toast({
        title: 'Thumbnail saved',
        description: 'The selected thumbnail has been saved to the video.',
      });
      
      return true;
    } catch (error) {
      console.error('Failed to save thumbnail:', error);
      toast({
        title: 'Failed to save thumbnail',
        description: error instanceof Error ? error.message : 'An error occurred while saving the thumbnail',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadCustomThumbnail,
    saveThumbnail
  };
};
