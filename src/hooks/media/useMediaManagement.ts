
import { useState, useEffect } from 'react';
import { MediaItem } from './types';
import { useMediaFetch } from './useMediaFetch';
import { useMediaStatus } from './useMediaStatus';
import { useMediaDelete } from './useMediaDelete';
import { useMediaOrder } from './useMediaOrder';

export const useMediaManagement = () => {
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  
  // Compose our hooks
  const { 
    media, 
    setMedia, 
    isLoading, 
    availableCategories,
    fetchMedia 
  } = useMediaFetch();
  
  const { 
    togglePublishStatus, 
    toggleFeaturedStatus 
  } = useMediaStatus(setMedia);
  
  const { 
    deleteMedia 
  } = useMediaDelete(setMedia);
  
  const { 
    hasUnsavedChanges, 
    setHasUnsavedChanges, 
    isSaving, 
    orderUpdateLogs, 
    saveOrder 
  } = useMediaOrder(setMedia, filteredMedia);

  // Set the filtered media initially to match the full media array
  useEffect(() => {
    setFilteredMedia(media);
  }, [media]);

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
