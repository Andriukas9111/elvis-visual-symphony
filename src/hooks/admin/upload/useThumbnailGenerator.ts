
import { useThumbnailState } from './useThumbnailState';
import { useThumbnailUploader } from './useThumbnailUploader';
import { 
  generateThumbnailsFromVideo, 
  uploadThumbnails,
  updateMediaThumbnail,
  requestServerThumbnailGeneration
} from '@/utils/upload/media/thumbnailGenerator';

/**
 * Main hook for thumbnail generation, combining state and upload functionality
 */
export const useThumbnailGenerator = () => {
  const {
    thumbnails,
    isGenerating,
    selectedThumbnail,
    selectedThumbnailIsVertical,
    generationProgress,
    setThumbnails,
    setIsGenerating,
    setGenerationProgress,
    selectThumbnail,
    toast
  } = useThumbnailState();

  const { uploadCustomThumbnail: uploadThumbnail, saveThumbnail: saveMediaThumbnail } = useThumbnailUploader();

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
          selectThumbnail(selectedThumb.url, !!selectedThumb.isVertical);
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
   * Save the selected thumbnail to the media entry
   */
  const saveThumbnail = async (mediaId: string) => {
    return saveMediaThumbnail(mediaId, selectedThumbnail, selectedThumbnailIsVertical);
  };

  /**
   * Upload a custom thumbnail
   */
  const uploadCustomThumbnail = async (file: File): Promise<string | null> => {
    return uploadThumbnail(file);
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
