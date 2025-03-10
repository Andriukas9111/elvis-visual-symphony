
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { Tables } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

export const useMedia = (
  options?: { 
    category?: string;
    featured?: boolean;
    limit?: number;
    search?: string;
    tags?: string[];
    orientation?: string;
  }, 
  queryOptions?: UseQueryOptions<Tables<'media'>[]>
) => {
  return useQuery({
    queryKey: ['media', options],
    queryFn: async () => {
      try {
        console.log("useMedia: Fetching media with options:", options);
        const result = await api.getMedia(options);
        
        if (!result || result.length === 0) {
          console.log("useMedia: No media items returned from API");
          return [];
        }
        
        console.log(`useMedia: Successfully fetched ${result.length} media items`);
        
        // Log a sample item to help with debugging
        if (result.length > 0) {
          console.log("useMedia: Sample media item:", {
            id: result[0].id,
            title: result[0].title,
            type: result[0].type,
            url: result[0].url,
            video_url: result[0].video_url,
            thumbnail_url: result[0].thumbnail_url,
            orientation: result[0].orientation
          });
        }
        
        return result;
      } catch (error) {
        console.error("useMedia: Error fetching media:", error);
        toast({ 
          title: 'Error loading media', 
          description: 'There was a problem loading the media. Please try again.',
          variant: 'destructive' 
        });
        throw error;
      }
    },
    ...queryOptions,
  });
};

export default useMedia;
