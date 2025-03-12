
import { useState } from 'react';

export const useMediaState = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orderUpdateLogs, setOrderUpdateLogs] = useState<any[]>([]);

  return {
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
  };
};
