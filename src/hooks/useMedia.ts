
import { useQuery } from '@tanstack/react-query';
import { getMedia } from '@/lib/api/mediaApi';

export interface ExtendedMedia {
  id: string;
  title: string;
  description: string | null;
  type: 'image' | 'video';
  file_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  video_id: string | null;
  category: string | null;
  tags: string[];
  orientation: 'horizontal' | 'vertical';
  is_published: boolean;
  is_featured: boolean;
  file_type: string | null;
  file_size: number | null;
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
