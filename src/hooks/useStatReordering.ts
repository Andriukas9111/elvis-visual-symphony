
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateStat, StatItem } from '@/hooks/api/useStats';

export const useStatReordering = (stats: StatItem[]) => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();
  const [isReordering, setIsReordering] = useState(false);

  const handleMoveUp = async (index: number) => {
    if (index === 0 || isReordering) return;
    
    try {
      setIsReordering(true);
      
      const currentStat = stats[index];
      const prevStat = stats[index - 1];
      
      // Swap sort_order values
      await updateStat.mutateAsync({
        id: currentStat.id,
        updates: { sort_order: prevStat.sort_order }
      });
      
      await updateStat.mutateAsync({
        id: prevStat.id,
        updates: { sort_order: currentStat.sort_order }
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
  
  const handleMoveDown = async (index: number) => {
    if (index === stats.length - 1 || isReordering) return;
    
    try {
      setIsReordering(true);
      
      const currentStat = stats[index];
      const nextStat = stats[index + 1];
      
      // Swap sort_order values
      await updateStat.mutateAsync({
        id: currentStat.id,
        updates: { sort_order: nextStat.sort_order }
      });
      
      await updateStat.mutateAsync({
        id: nextStat.id,
        updates: { sort_order: currentStat.sort_order }
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
