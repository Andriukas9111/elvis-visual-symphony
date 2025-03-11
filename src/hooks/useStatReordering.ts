
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateStat, StatItem } from '@/hooks/api/useStats';

export const useStatReordering = () => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();
  const [isReordering, setIsReordering] = useState(false);

  const handleMoveUp = async (currentItem: StatItem, stats: StatItem[]) => {
    const index = stats.findIndex(item => item.id === currentItem.id);
    if (index === 0 || isReordering || !stats[index].id || !stats[index - 1].id) return;
    
    try {
      setIsReordering(true);
      
      const prevItem = stats[index - 1];
      
      // Save the original sort_order values
      const currentSortOrder = currentItem.sort_order;
      const prevSortOrder = prevItem.sort_order;
      
      // Swap sort_order values
      await updateStat.mutateAsync({
        id: currentItem.id,
        updates: { sort_order: prevSortOrder }
      });
      
      await updateStat.mutateAsync({
        id: prevItem.id,
        updates: { sort_order: currentSortOrder }
      });
      
      toast({
        title: "Order updated",
        description: "Item successfully moved up"
      });
    } catch (error) {
      console.error("Error moving item up:", error);
      toast({
        title: "Error",
        description: "Failed to update item order",
        variant: "destructive"
      });
    } finally {
      setIsReordering(false);
    }
  };
  
  const handleMoveDown = async (currentItem: StatItem, stats: StatItem[]) => {
    const index = stats.findIndex(item => item.id === currentItem.id);
    if (index === stats.length - 1 || isReordering || !stats[index].id || !stats[index + 1].id) return;
    
    try {
      setIsReordering(true);
      
      const nextItem = stats[index + 1];
      
      // Save the original sort_order values
      const currentSortOrder = currentItem.sort_order;
      const nextSortOrder = nextItem.sort_order;
      
      // Swap sort_order values
      await updateStat.mutateAsync({
        id: currentItem.id,
        updates: { sort_order: nextSortOrder }
      });
      
      await updateStat.mutateAsync({
        id: nextItem.id,
        updates: { sort_order: currentSortOrder }
      });
      
      toast({
        title: "Order updated",
        description: "Item successfully moved down"
      });
    } catch (error) {
      console.error("Error moving item down:", error);
      toast({
        title: "Error",
        description: "Failed to update item order",
        variant: "destructive"
      });
    } finally {
      setIsReordering(false);
    }
  };
  
  return {
    handleMoveUp,
    handleMoveDown,
    isReordering
  };
};
