
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { 
  generateThumbnailsFromVideo, 
  uploadThumbnails,
  updateMediaThumbnail,
  requestServerThumbnailGeneration
} from '@/utils/upload/media/thumbnailGenerator';

export const useThumbnailGenerator = () => {
  const [thumbnails, setThumbnails] = useState<Array<{ url: string; timestamp: number; isVertical?: boolean }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [selectedThumbnailIsVertical, setSelectedThumbnailIsVertical] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  /**
   * Generate thumbnails from a video file
   */
  const generateThumbnails = async (videoFile: File, videoUrl?: string, videoId?: string) => {
    if (!videoFile && !videoUrl) {
      toast({
        title: 'Invalid input',
        description: 'Please provide either a video file or a video URL to generate thumbnails.',
        variant: 'destructive',
      });
      return [];
    }
    
    setIsGenerating(true);
    setGenerationProgress(10);
    
    try {
      let uploadedThumbnails: Array<{ url: string; timestamp: number; isVertical?: boolean }> = [];
      let isVideoVertical = false;
      
      // Try server-side generation first if videoId and URL are provided
      if (videoId && videoUrl) {
        setGenerationProgress(30);
        const serverResult = await requestServerThumbnailGeneration(videoId, videoUrl);
        
        if (serverResult) {
          isVideoVertical = serverResult.isVertical;
          uploadedThumbnails = [{ url: serverResult.url, timestamp: 0, isVertical: isVideoVertical }];
          setGenerationProgress(100);
        } else {
          setGenerationProgress(40);
          console.log('Server-side thumbnail generation failed, falling back to client-side');
        }
      }
      
      // If server-side generation failed or wasn't attempted, try client-side
      if (uploadedThumbnails.length === 0 && videoFile) {
        // Generate thumbnail blobs from the video
        setGenerationProgress(50);
        const thumbnailBlobs = await generateThumbnailsFromVideo(videoFile);
        
        // Get video orientation from the first thumbnail
        if (thumbnailBlobs.length > 0) {
          isVideoVertical = thumbnailBlobs[0].isVertical;
        }
        
        // Upload thumbnails to storage
        setGenerationProgress(70);
        uploadedThumbnails = await uploadThumbnails(thumbnailBlobs, videoFile.name);
        setGenerationProgress(100);
      }
      
      // If we have thumbnails, process them
      if (uploadedThumbnails.length > 0) {
        setThumbnails(uploadedThumbnails);
        
        // Select the middle thumbnail by default
        if (uploadedThumbnails.length > 0) {
          const middleIndex = Math.floor(uploadedThumbnails.length / 2);
          const selectedThumb = uploadedThumbnails[middleIndex];
          setSelectedThumbnail(selectedThumb.url);
          setSelectedThumbnailIsVertical(!!selectedThumb.isVertical);
        }
        
        toast({
          title: 'Thumbnails generated',
          description: `Generated ${uploadedThumbnails.length} thumbnails from your ${isVideoVertical ? 'vertical' : 'horizontal'} video.`,
        });
      } else {
        throw new Error('Failed to generate thumbnails using both server and client methods');
      }
      
      return uploadedThumbnails;
    } catch (error) {
      console.error('Failed to generate thumbnails:', error);
      toast({
        title: 'Thumbnail generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate thumbnails',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Set a specific thumbnail as selected
   */
  const selectThumbnail = (url: string, isVertical: boolean = false) => {
    setSelectedThumbnail(url);
    setSelectedThumbnailIsVertical(isVertical);
  };

  /**
   * Save the selected thumbnail to the media entry
   */
  const saveThumbnail = async (mediaId: string) => {
    if (!selectedThumbnail) {
      toast({
        title: 'No thumbnail selected',
        description: 'Please select a thumbnail first.',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      const success = await updateMediaThumbnail(
        mediaId, 
        selectedThumbnail, 
        selectedThumbnailIsVertical
      );
      
      if (success) {
        toast({
          title: 'Thumbnail saved',
          description: 'The selected thumbnail has been saved to the video.',
        });
      } else {
        throw new Error('Failed to update thumbnail');
      }
      
      return success;
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
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
        
      // Add to thumbnails and select it
      const thumbnailUrl = urlData.publicUrl;
      setThumbnails(prev => [...prev, { url: thumbnailUrl, timestamp: 0, isVertical }]);
      setSelectedThumbnail(thumbnailUrl);
      setSelectedThumbnailIsVertical(isVertical);
      
      toast({
        title: 'Custom thumbnail uploaded',
        description: `Your custom ${isVertical ? 'vertical' : 'horizontal'} thumbnail has been uploaded and selected.`,
      });
      
      return thumbnailUrl;
    } catch (error) {
      console.error('Error uploading custom thumbnail:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload custom thumbnail',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    thumbnails,
    isGenerating,
    selectedThumbnail,
    selectedThumbnailIsVertical,
    generationProgress,
    generateThumbnails,
    selectThumbnail,
    saveThumbnail,
    uploadCustomThumbnail
  };
};
