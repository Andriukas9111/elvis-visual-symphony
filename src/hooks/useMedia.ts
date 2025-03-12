
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMedia } from '@/lib/api/mediaApi'; // Ensure correct import path
import { Tables } from '@/types/supabase';

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
    queryFn: () => getMedia(options),
    ...queryOptions,
  });
};

export default useMedia;
