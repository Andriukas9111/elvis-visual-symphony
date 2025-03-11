
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { MediaItem } from './types';

export const useMediaStatus = (setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>) => {
  const { toast } = useToast();

  const togglePublishStatus = async (mediaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ is_published: !currentStatus })
        .eq('id', mediaId);
        
      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Media item is now ${!currentStatus ? 'published' : 'unpublished'}`,
      });
      
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_published: !currentStatus } : item
        )
      );
      
    } catch (error: any) {
      console.error('Error updating media status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleFeaturedStatus = async (mediaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ is_featured: !currentStatus })
        .eq('id', mediaId);
        
      if (error) throw error;
      
      toast({
        title: currentStatus ? 'Removed from featured' : 'Added to featured',
        description: `Media item is now ${!currentStatus ? 'featured' : 'unfeatured'}`,
      });
      
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_featured: !currentStatus } : item
        )
      );
      
    } catch (error: any) {
      console.error('Error updating featured status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    togglePublishStatus,
    toggleFeaturedStatus
  };
};
