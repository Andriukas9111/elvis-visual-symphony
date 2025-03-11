
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { useUpdateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import { useToast } from '@/components/ui/use-toast';

interface StatsTableProps {
  stats: StatItem[];
  formatNumber: (num: number) => string;
  getIconByName: (iconName: string) => React.ReactNode;
}

const StatsTable: React.FC<StatsTableProps> = ({ stats, formatNumber, getIconByName }) => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();

  const handleUpdateOrder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = stats.findIndex(s => s.id === id);
    if (currentIndex === -1) return;
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === stats.length - 1) return;
    
    const swapWith = direction === 'up' 
      ? stats[currentIndex - 1] 
      : stats[currentIndex + 1];
    
    const currentStat = stats[currentIndex];
    
    try {
      // Update the current stat's order
      await updateStat.mutateAsync({
        id: currentStat.id,
        updates: { sort_order: swapWith.sort_order }
      });
      
      // Update the other stat's order
      await updateStat.mutateAsync({
        id: swapWith.id,
        updates: { sort_order: currentStat.sort_order }
      });
      
      toast({
        title: "Order updated",
        description: "The display order has been updated."
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Update failed",
        description: "Failed to update order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (confirm('Are you sure you want to delete this stat?')) {
      try {
        await deleteStat.mutateAsync(id);
        toast({
          title: "Stat deleted",
          description: "The stat has been successfully deleted."
        });
      } catch (error) {
        console.error('Error deleting stat:', error);
        toast({
          title: "Deletion failed",
          description: "Failed to delete stat. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (stats.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-white/20 rounded-md">
        <p className="text-white/60">No statistics found. Add your first stat using the form below.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-elvis-light/10 text-left">
            <th className="p-2 border-b border-white/10">Icon</th>
            <th className="p-2 border-b border-white/10">Label</th>
            <th className="p-2 border-b border-white/10">Value</th>
            <th className="p-2 border-b border-white/10">Display</th>
            <th className="p-2 border-b border-white/10">Order</th>
            <th className="p-2 border-b border-white/10">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.id} className="hover:bg-elvis-light/5">
              <td className="p-2 border-b border-white/10">
                <div className="flex items-center justify-center p-1 bg-white/10 rounded-md">
                  {getIconByName(stat.icon_name)}
                </div>
              </td>
              <td className="p-2 border-b border-white/10">{stat.label}</td>
              <td className="p-2 border-b border-white/10">{stat.value}</td>
              <td className="p-2 border-b border-white/10">
                {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}{stat.suffix || ''}
              </td>
              <td className="p-2 border-b border-white/10">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleUpdateOrder(stat.id, 'up')}
                    disabled={stats.indexOf(stat) === 0}
                    className="h-7 w-7"
                  >
                    <span className="sr-only">Move up</span>
                    ↑
                  </Button>
                  <span className="mx-1">{stat.sort_order}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleUpdateOrder(stat.id, 'down')}
                    disabled={stats.indexOf(stat) === stats.length - 1}
                    className="h-7 w-7"
                  >
                    <span className="sr-only">Move down</span>
                    ↓
                  </Button>
                </div>
              </td>
              <td className="p-2 border-b border-white/10">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => console.log('Edit stat:', stat.id)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteStat(stat.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-400"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;
