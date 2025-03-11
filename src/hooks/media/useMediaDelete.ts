
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { MediaItem } from './types';

export const useMediaDelete = (setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>) => {
  const { toast } = useToast();

  const deleteMedia = async (mediaId: string) => {
    try {
      const { data: mediaItem, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('id', mediaId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const { error: deleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId);
        
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Media deleted',
        description: 'The media item has been successfully deleted.',
      });
      
      setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));
      
    } catch (error: any) {
      console.error('Error deleting media:', error.message);
      toast({
        title: 'Error deleting media',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    deleteMedia
  };
};
