
import { useMediaState } from './media/useMediaState';
import { useMediaFetching } from './media/useMediaFetching';
import { useMediaStatusActions } from './media/useMediaStatusActions';
import { useMediaDeletion } from './media/useMediaDeletion';
import { useMediaSorting } from './media/useMediaSorting';

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
  
  const { fetchMedia } = useMediaFetching(
    setIsLoading,
    setMedia,
    setAvailableCategories
  );
  
  const { togglePublishStatus, toggleFeaturedStatus } = useMediaStatusActions(setMedia);
  
  const { deleteMedia } = useMediaDeletion(setMedia);
  
  const { saveOrder } = useMediaSorting(
    filteredMedia,
    setMedia,
    setHasUnsavedChanges,
    setIsSaving,
    hasUnsavedChanges,
    setOrderUpdateLogs
  );

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
