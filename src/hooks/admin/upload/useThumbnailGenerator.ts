
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  generateThumbnailsFromVideo, 
  uploadThumbnails,
  updateMediaThumbnail
} from '@/utils/upload/media/thumbnailGenerator';

export const useThumbnailGenerator = () => {
  const [thumbnails, setThumbnails] = useState<Array<{ url: string; timestamp: number }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Generate thumbnails from a video file
   */
  const generateThumbnails = async (videoFile: File) => {
    if (!videoFile || !videoFile.type.startsWith('video/')) {
      toast({
        title: 'Invalid file',
        description: 'Please provide a valid video file to generate thumbnails.',
        variant: 'destructive',
      });
      return [];
    }
    
    setIsGenerating(true);
    try {
      // Generate thumbnail blobs from the video
      const thumbnailBlobs = await generateThumbnailsFromVideo(videoFile);
      
      // Upload thumbnails to storage
      const uploadedThumbnails = await uploadThumbnails(thumbnailBlobs, videoFile.name);
      
      setThumbnails(uploadedThumbnails);
      
      // Select the middle thumbnail by default
      if (uploadedThumbnails.length > 0) {
        const middleIndex = Math.floor(uploadedThumbnails.length / 2);
        setSelectedThumbnail(uploadedThumbnails[middleIndex].url);
      }
      
      toast({
        title: 'Thumbnails generated',
        description: `Generated ${uploadedThumbnails.length} thumbnails from your video.`,
      });
      
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
  const selectThumbnail = (url: string) => {
    setSelectedThumbnail(url);
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
      const success = await updateMediaThumbnail(mediaId, selectedThumbnail);
      
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

  return {
    thumbnails,
    isGenerating,
    selectedThumbnail,
    generateThumbnails,
    selectThumbnail,
    saveThumbnail
  };
};
