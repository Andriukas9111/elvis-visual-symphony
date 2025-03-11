
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { MediaItem } from './types';

export const useMediaFetch = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log('Media fetch result:', {
        count: data?.length || 0,
        firstItem: data && data.length > 0 ? data[0] : null,
        hasOrderValues: data && data.length > 0 ? data.every(item => item.sort_order !== null) : false
      });
      
      // Ensure all items have a sort_order value
      const processedData = (data || []).map((item, index) => ({
        ...item,
        sort_order: item.sort_order ?? (1000 + index) // Fallback sort order if not defined
      }));
      
      setMedia(processedData);
      
      const categories = Array.from(
        new Set((processedData || []).map(item => item.category))
      ).filter(Boolean) as string[];
      
      setAvailableCategories(categories);
      
    } catch (error: any) {
      console.error('Error fetching media:', error.message);
      toast({
        title: 'Error loading media',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    media,
    setMedia,
    isLoading,
    availableCategories,
    fetchMedia
  };
};
