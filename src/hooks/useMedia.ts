
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMedia } from '@/lib/api';
import { Tables } from '@/types/supabase';
import { toast } from 'sonner';

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
        return await getMedia(options);
      } catch (error) {
        console.error('Error fetching media:', error);
        toast.error('Failed to load media content');
        return [];
      }
    },
    ...queryOptions,
  });
};

export default useMedia;
