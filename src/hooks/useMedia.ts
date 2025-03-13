
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface ExtendedMedia {
  id: string;
  title: string;
  description: string | null;
  type: 'image' | 'video';
  file_url: string | null;
  video_url: string | null;
  video_id?: string | null;
  thumbnail_url: string | null;
  category: string | null;
  tags: string[];
  orientation: 'horizontal' | 'vertical';
  is_published: boolean;
  is_featured: boolean;
  file_type: string | null;
  metadata: {
    file_size?: number;
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  } | null;
  created_at: string;
  updated_at: string;
  sort_order: number | null;
  slug: string | null;
}

interface UseMediaProps {
  featured?: boolean;
  category?: string;
  limit?: number;
  search?: string;
  tags?: string[];
  orientation?: string;
  enabled?: boolean;
}

export const getMedia = async (props: UseMediaProps = {}): Promise<ExtendedMedia[]> => {
  const { 
    featured = false, 
    category,
    limit,
    search,
    tags,
    orientation,
  } = props;

  let query = supabase
    .from('media')
    .select('*');

  // Apply filters
  if (featured) {
    query = query.eq('is_featured', true);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  if (orientation) {
    query = query.eq('orientation', orientation);
  }

  // Only show published items
  query = query.eq('is_published', true);

  // Apply limit if specified
  if (limit) {
    query = query.limit(limit);
  }

  // Order by sort_order and then by creation date
  // Sorting null values to appear last
  query = query.order('sort_order', { ascending: true, nullsFirst: false })
               .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching media:', error);
    throw error;
  }

  return data || [];
};

export const useMedia = (props: UseMediaProps = {}) => {
  const { 
    featured = false, 
    category,
    limit,
    search,
    tags,
    orientation, 
    enabled = true 
  } = props;

  return useQuery({
    queryKey: ['media', { featured, category, limit, search, tags, orientation }],
    queryFn: () => getMedia({ featured, category, limit, search, tags, orientation }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
