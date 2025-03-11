
import { useToast } from '@/components/ui/use-toast';
import { StatItem, useUpdateStat } from '@/hooks/api/useStats';

export const useStatReordering = (stats: StatItem[] = []) => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();

  const handleMoveUp = async (index: number) => {
    if (index <= 0 || !stats) return;
    
    try {
      const currentStat = stats[index];
      const prevStat = stats[index - 1];
      
      await Promise.all([
        updateStat.mutateAsync({
          id: currentStat.id,
          updates: { sort_order: prevStat.sort_order }
        }),
        updateStat.mutateAsync({
          id: prevStat.id,
          updates: { sort_order: currentStat.sort_order }
        })
      ]);
      
      toast({
        title: "Success",
        description: "Reordered successfully"
      });
    } catch (error) {
      console.error("Error reordering:", error);
      toast({
        title: "Error",
        description: "Failed to reorder",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (index: number) => {
    if (!stats || index >= stats.length - 1) return;
    
    try {
      const currentStat = stats[index];
      const nextStat = stats[index + 1];
      
      await Promise.all([
        updateStat.mutateAsync({
          id: currentStat.id,
          updates: { sort_order: nextStat.sort_order }
        }),
        updateStat.mutateAsync({
          id: nextStat.id,
          updates: { sort_order: currentStat.sort_order }
        })
      ]);
      
      toast({
        title: "Success",
        description: "Reordered successfully"
      });
    } catch (error) {
      console.error("Error reordering:", error);
      toast({
        title: "Error",
        description: "Failed to reorder",
        variant: "destructive"
      });
    }
  };

  return {
    handleMoveUp,
    handleMoveDown
  };
};
