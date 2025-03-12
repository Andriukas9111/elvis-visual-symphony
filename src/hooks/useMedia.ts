
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMedia } from '@/lib/api/mediaApi'; // Ensure correct import path
import { Tables } from '@/types/supabase';

// Define an extended media type that includes file_url
export type ExtendedMedia = Tables<'media'> & {
  file_url?: string;
  sort_order?: number;
};

export const useMedia = (
  options?: { 
    category?: string;
    featured?: boolean;
    limit?: number;
    search?: string;
    tags?: string[];
    orientation?: string;
  }, 
  queryOptions?: UseQueryOptions<ExtendedMedia[]>
) => {
  return useQuery({
    queryKey: ['media', options],
    queryFn: () => getMedia(options) as Promise<ExtendedMedia[]>,
    ...queryOptions,
  });
};

export default useMedia;
