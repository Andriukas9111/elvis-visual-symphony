
import { getYoutubeId, isYoutubeUrl } from '@/components/portfolio/video-player/utils';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface UploadResult {
  success: boolean;
  message: string;
  videoId?: string;
}

export const useYoutubeUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const uploadMutation = useMutation<UploadResult, Error, { url: string }>({
    mutationFn: async ({ url }) => {
      setUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);

      if (!isYoutubeUrl(url)) {
        setUploadStatus('error');
        return { success: false, message: 'Invalid YouTube URL.' };
      }

      const videoId = getYoutubeId(url);
      if (!videoId) {
        setUploadStatus('error');
        return { success: false, message: 'Could not extract video ID from URL.' };
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      try {
        // Check if the videoId already exists in the database
        const { data: existingVideo, error: selectError } = await supabase
          .from('media')
          .select('id')
          .eq('youtube_video_id', videoId)
          .single();

        if (selectError) {
          console.error("Error checking for existing video:", selectError);
          return { success: false, message: 'Error checking for existing video.' };
        }

        if (existingVideo) {
          return { success: false, message: 'This YouTube video is already in the database.' };
        }

        // If videoId doesn't exist, proceed to insert it
        const { error: insertError } = await supabase
          .from('media')
          .insert([
            {
              title: 'YouTube Video',
              slug: `youtube-${videoId}`,
              media_type: 'video',
              youtube_video_id: videoId,
              is_published: false,
            },
          ]);

        if (insertError) {
          console.error("Error inserting YouTube video ID:", insertError);
          return { success: false, message: 'Failed to save YouTube video ID.' };
        }

        setUploadProgress(100);
        setUploadStatus('success');
        return { success: true, message: 'YouTube video ID saved successfully!', videoId: videoId };
      } finally {
        clearInterval(progressInterval);
      }
    },
    onSuccess: (data) => {
      setUploading(false);
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.message,
        });
      }
    },
    onError: (error) => {
      setUploading(false);
      setUploadStatus('error');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to upload YouTube video ID.',
      });
    },
  });

  const submitYoutubeVideo = (data: { url: string }) => {
    uploadMutation.mutate({ url: data.url });
  };

  return {
    uploadProgress,
    uploadStatus,
    isUploading: uploading,
    submitYoutubeVideo,
    upload: uploadMutation.mutate,
    uploading
  };
};

export default useYoutubeUploader;
