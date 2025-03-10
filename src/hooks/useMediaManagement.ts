
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { updateMediaSortOrder } from '@/lib/api';

export const useMediaManagement = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<any[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMedia(data || []);
      
      const categories = Array.from(
        new Set((data || []).map(item => item.category))
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

  const saveOrder = async () => {
    if (!hasUnsavedChanges) return;
    
    try {
      setIsSaving(true);
      
      const updates = filteredMedia.map((item, index) => ({
        id: item.id,
        sort_order: index + 1
      }));
      
      await updateMediaSortOrder(updates);
      
      setMedia(prevMedia => {
        const updatedMedia = [...prevMedia];
        const sortOrderMap = new Map();
        updates.forEach(update => sortOrderMap.set(update.id, update.sort_order));
        
        return updatedMedia.map(item => ({
          ...item,
          sort_order: sortOrderMap.has(item.id) ? sortOrderMap.get(item.id) : item.sort_order
        }));
      });
      
      toast({
        title: 'Order saved',
        description: 'The new display order has been saved successfully.',
      });
      
      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error('Error saving order:', error.message);
      toast({
        title: 'Error saving order',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    media,
    setMedia,
    filteredMedia,
    setFilteredMedia,
    isLoading,
    availableCategories,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    fetchMedia,
    togglePublishStatus,
    toggleFeaturedStatus,
    deleteMedia,
    saveOrder
  };
};
