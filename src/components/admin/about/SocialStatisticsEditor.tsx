
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useStats, useUpdateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import { Plus } from 'lucide-react';
import AdminLoadingState from '../AdminLoadingState';
import SocialStatisticsForm from './social-statistics/SocialStatisticsForm';
import SocialStatisticsList from './social-statistics/SocialStatisticsList';

const SocialStatisticsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: allStats, isLoading } = useStats();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StatItem>>({
    icon_name: 'Camera',
    label: '',
    value: 0,
    suffix: '',
    sort_order: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  const socialStats = allStats?.filter(
    stat => ['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name)
  ) || [];

  const handleAddNew = () => {
    setFormData({
      icon_name: 'Camera',
      label: '',
      value: 0,
      suffix: '+',
      sort_order: socialStats.length
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleEdit = (stat: StatItem) => {
    setIsEditing(stat.id);
    setFormData(stat);
    setIsAdding(false);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this social statistic?")) {
      try {
        await deleteStat.mutateAsync(id);
        toast({
          title: "Success",
          description: "Social statistic deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting social statistic:", error);
        toast({
          title: "Error",
          description: "Failed to delete social statistic",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0 || !socialStats) return;
    
    try {
      const currentStat = socialStats[index];
      const prevStat = socialStats[index - 1];
      
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
    if (!socialStats || index >= socialStats.length - 1) return;
    
    try {
      const currentStat = socialStats[index];
      const nextStat = socialStats[index + 1];
      
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

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Social Statistics</h2>
          <p className="text-sm text-muted-foreground">
            Manage your social statistics shown in the About section
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={isAdding} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Statistic
        </Button>
      </div>

      {(isAdding || isEditing) && (
        <SocialStatisticsForm 
          formData={formData}
          setFormData={setFormData}
          onCancel={handleCancelForm}
          isEditing={isEditing}
        />
      )}

      <SocialStatisticsList 
        stats={socialStats}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SocialStatisticsEditor;
