
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { extractYouTubeId, getYoutubeId } from '@/components/portfolio/video-player/utils';
import { createMedia } from '@/lib/api';

interface UseYoutubeUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

interface YoutubeData {
  url: string;
  title: string;
  description: string;
}

export const useYoutubeUploader = ({ onUploadComplete }: UseYoutubeUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const getThumbnailFromYoutubeId = (id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  const submitYoutubeVideo = async (youtubeData: YoutubeData) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(30);

      // We can use either function since we've made them aliases of each other
      const youtubeId = getYoutubeId(youtubeData.url);
      
      if (!youtubeId) {
        throw new Error('Invalid YouTube URL. Supported formats: regular videos, Shorts, and youtu.be links');
      }
      
      console.log('Processing YouTube video with ID:', youtubeId);
      
      const videoUrl = `https://www.youtube.com/embed/${youtubeId}`;
      const thumbnailUrl = getThumbnailFromYoutubeId(youtubeId);
      
      setUploadProgress(60);
      
      // Determine if it's a YouTube Short
      const isShort = youtubeData.url.includes('/shorts/');
      
      // Create a media entry in the database
      const mediaData = await createMedia({
        title: youtubeData.title || `YouTube ${isShort ? 'Short' : 'Video'} ${youtubeId}`,
        slug: (youtubeData.title || `youtube-${isShort ? 'short' : 'video'}-${youtubeId}`).toLowerCase().replace(/\s+/g, '-'),
        description: youtubeData.description,
        type: 'video',
        category: isShort ? 'youtube-shorts' : 'youtube',
        url: videoUrl,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        is_published: false,
        orientation: isShort ? 'vertical' : 'horizontal',
        tags: isShort ? ['youtube', 'shorts'] : ['youtube']
      });

      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: `YouTube ${isShort ? 'Short' : 'Video'} added`,
        description: 'Your YouTube content has been added successfully.',
      });
      
      onUploadComplete(mediaData);
      
      // Reset the form after a successful upload
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
        setIsUploading(false);
      }, 1500);
      
    } catch (error: any) {
      console.error('YouTube error:', error.message);
      setUploadStatus('error');
      toast({
        title: 'Failed to add YouTube video',
        description: error.message,
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    submitYoutubeVideo
  };
};
