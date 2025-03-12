
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { updateMediaOrder } from '@/utils/upload/mediaDatabase';
import { useMediaState } from './media/useMediaState';

export const useMediaManagement = () => {
  const {
    media,
    setMedia,
    filteredMedia,
    setFilteredMedia,
    isLoading,
    setIsLoading,
    availableCategories,
    setAvailableCategories,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    setIsSaving,
    orderUpdateLogs,
    setOrderUpdateLogs
  } = useMediaState();
  
  const { toast } = useToast();
  
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      // Fetch all media from the database
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setMedia(data || []);
      setFilteredMedia(data || []);
      
      // Extract unique categories
      const categories = Array.from(
        new Set((data || []).map(item => item.category).filter(Boolean))
      );
      setAvailableCategories(categories);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error fetching media',
        description: 'There was a problem loading your media. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      setMedia([]);
      setFilteredMedia([]);
    }
  };
  
  const togglePublishStatus = async (mediaId: string) => {
    try {
      const mediaItem = media.find(item => item.id === mediaId);
      if (!mediaItem) return;
      
      const newStatus = !mediaItem.is_published;
      
      // Update the database
      const { error } = await supabase
        .from('media')
        .update({ is_published: newStatus })
        .eq('id', mediaId);
      
      if (error) throw error;
      
      // Update local state
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_published: newStatus } : item
        )
      );
      
      setFilteredMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_published: newStatus } : item
        )
      );
      
      toast({
        title: newStatus ? 'Media published' : 'Media unpublished',
        description: `The media has been ${newStatus ? 'published' : 'unpublished'}.`,
      });
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating the media. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleFeaturedStatus = async (mediaId: string) => {
    try {
      const mediaItem = media.find(item => item.id === mediaId);
      if (!mediaItem) return;
      
      const newStatus = !mediaItem.is_featured;
      
      // Update the database
      const { error } = await supabase
        .from('media')
        .update({ is_featured: newStatus })
        .eq('id', mediaId);
      
      if (error) throw error;
      
      // Update local state
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_featured: newStatus } : item
        )
      );
      
      setFilteredMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_featured: newStatus } : item
        )
      );
      
      toast({
        title: newStatus ? 'Media featured' : 'Media unfeatured',
        description: `The media has been ${newStatus ? 'marked as featured' : 'removed from featured'}.`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating the media. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId);
      
      if (error) throw error;
      
      // Update local state
      setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));
      setFilteredMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));
      
      toast({
        title: 'Media deleted',
        description: 'The media has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Deletion failed',
        description: 'There was a problem deleting the media. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const saveOrder = async () => {
    setIsSaving(true);
    
    try {
      // Prepare updates for all filtered media with their sort order
      const orderUpdates = filteredMedia.map((item, index) => ({
        id: item.id,
        sort_order: index + 1
      }));
      
      // Update the order in the database
      await updateMediaOrder(orderUpdates);
      
      // Add a log entry
      const newLog = {
        timestamp: Date.now(),
        message: 'Media order updated successfully'
      };
      setOrderUpdateLogs(prev => [...prev, newLog]);
      
      toast({
        title: 'Order saved',
        description: 'The media order has been saved successfully.',
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving order:', error);
      
      toast({
        title: 'Save failed',
        description: 'There was a problem saving the media order. Please try again.',
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
    orderUpdateLogs,
    fetchMedia,
    togglePublishStatus,
    toggleFeaturedStatus,
    deleteMedia,
    saveOrder
  };
};
