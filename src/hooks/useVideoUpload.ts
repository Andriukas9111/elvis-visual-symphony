
import { useState } from 'react';
import { uploadVideoAndCreateMedia } from '@/utils/video/videoIntegration';
import { useToast } from '@/components/ui/use-toast';

export function useVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadVideo = async (
    file: File,
    mediaInfo: {
      title?: string;
      description?: string;
      category?: string;
      tags?: string[];
      is_published?: boolean;
      is_featured?: boolean;
      orientation?: 'horizontal' | 'vertical';
    }
  ) => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    // Validate file type
    if (!file.type.includes('video/')) {
      setError('File must be a video');
      toast({
        title: 'Invalid file type',
        description: 'Please select a video file.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const media = await uploadVideoAndCreateMedia(
        file,
        mediaInfo,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setUploadedVideo(media);
      toast({
        title: 'Upload successful',
        description: 'Your video has been uploaded successfully.',
      });
      
      return media;
    } catch (err: any) {
      console.error('Video upload error:', err);
      setError(err.message || 'Failed to upload video');
      
      toast({
        title: 'Upload failed',
        description: err.message || 'An error occurred while uploading your video.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadProgress(0);
    setUploadedVideo(null);
    setError(null);
  };

  return {
    uploadVideo,
    resetUpload,
    isUploading,
    uploadProgress,
    uploadedVideo,
    error,
  };
}
