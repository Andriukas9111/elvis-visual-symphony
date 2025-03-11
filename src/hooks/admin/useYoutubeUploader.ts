
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

  const uploadMutation = useMutation<UploadResult, Error, { url: string }>({
    mutationFn: async ({ url }) => {
      setUploading(true);

      if (!isYoutubeUrl(url)) {
        return { success: false, message: 'Invalid YouTube URL.' };
      }

      const videoId = getYoutubeId(url);
      if (!videoId) {
        return { success: false, message: 'Could not extract video ID from URL.' };
      }

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

      return { success: true, message: 'YouTube video ID saved successfully!', videoId: videoId };
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to upload YouTube video ID.',
      });
    },
  });

  return { upload: uploadMutation.mutate, uploading };
};

// Default export for backward compatibility
export default useYoutubeUploader;
