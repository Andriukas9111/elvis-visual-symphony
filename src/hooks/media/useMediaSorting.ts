
import { useToast } from '@/components/ui/use-toast';
import { updateMediaSortOrder } from '@/lib/api';

export const useMediaSorting = (
  filteredMedia: any[],
  setMedia: (callback: (prevMedia: any[]) => any[]) => void,
  setHasUnsavedChanges: (value: boolean) => void,
  setIsSaving: (value: boolean) => void,
  hasUnsavedChanges: boolean,
  setOrderUpdateLogs: (callback: (prev: any[]) => any[]) => void
) => {
  const { toast } = useToast();

  const saveOrder = async () => {
    if (!hasUnsavedChanges) return;
    
    try {
      setIsSaving(true);
      
      const updates = filteredMedia.map((item, index) => ({
        id: item.id,
        sort_order: index + 1
      }));
      
      // Log the updates for debugging purposes
      const updateLog = {
        timestamp: new Date().toISOString(),
        updates: updates.map(u => ({ id: u.id, new_order: u.sort_order }))
      };
      setOrderUpdateLogs(prev => [...prev, updateLog]);
      console.log('Order update log:', updateLog);
      
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

  return { saveOrder };
};
