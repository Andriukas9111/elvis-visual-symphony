
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useStats, useUpdateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import { Plus } from 'lucide-react';
import AdminLoadingState from '../AdminLoadingState';
import SocialStatisticsForm from './social-statistics/SocialStatisticsForm';
import SocialStatisticsList from './social-statistics/SocialStatisticsList';
import { useStatReordering } from '@/hooks/useStatReordering';

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
    sort_order: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  const socialStats = allStats?.filter(
    stat => ['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name || '')
  ) || [];
  
  const { handleMoveUp, handleMoveDown } = useStatReordering();

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

  const handleMoveUpItem = (index: number) => {
    if (index > 0 && socialStats.length > 1) {
      handleMoveUp(socialStats[index], socialStats);
    }
  };

  const handleMoveDownItem = (index: number) => {
    if (index < socialStats.length - 1) {
      handleMoveDown(socialStats[index], socialStats);
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
        onMoveUp={handleMoveUpItem}
        onMoveDown={handleMoveDownItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SocialStatisticsEditor;
