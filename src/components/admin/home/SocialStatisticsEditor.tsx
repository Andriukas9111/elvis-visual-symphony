
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import { useStats, useCreateStat, useUpdateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import SocialStatForm from './components/SocialStatForm';
import SocialStatItem from './components/SocialStatItem';

const SocialStatisticsEditor = () => {
  const { toast } = useToast();
  const { data: stats, isLoading } = useStats({ tab: 'social' });
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();

  const [isAdding, setIsAdding] = useState(false);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);

  const handleAddStat = async (statData: { title: string; value: string; icon: string }) => {
    try {
      await createStat.mutateAsync({
        label: statData.title,
        value: parseInt(statData.value) || 0,
        icon_name: statData.icon,
        suffix: '',
        tab: 'social',
        sort_order: stats?.length || 0
      });
      
      toast({
        title: 'Success',
        description: 'Social statistic added successfully',
      });
      
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding stat:', error);
      toast({
        title: 'Error',
        description: 'Failed to add social statistic',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStat = async (id: string, updates: { title: string; value: string; icon: string }) => {
    try {
      await updateStat.mutateAsync({
        id,
        updates: {
          label: updates.title,
          value: parseInt(updates.value) || 0,
          icon_name: updates.icon,
          tab: 'social'
        }
      });
      
      toast({
        title: 'Success',
        description: 'Social statistic updated successfully',
      });
      
      setEditingStat(null);
    } catch (error) {
      console.error('Error updating stat:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social statistic',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;
    
    try {
      await deleteStat.mutateAsync(id);
      
      toast({
        title: 'Success',
        description: 'Social statistic deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete social statistic',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (stat: StatItem) => {
    setEditingStat(stat);
  };

  const handleCancelEdit = () => {
    setEditingStat(null);
  };

  const socialStats = React.useMemo(() => {
    return stats?.filter(stat => stat.tab === 'social') || [];
  }, [stats]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Social Media Statistics</CardTitle>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Statistic</span>
          </Button>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {isAdding && (
                <SocialStatForm
                  onSave={handleAddStat}
                  onCancel={() => setIsAdding(false)}
                />
              )}
              
              {editingStat && (
                <SocialStatForm
                  initialData={editingStat}
                  onSave={(data) => handleUpdateStat(editingStat.id, data)}
                  onCancel={handleCancelEdit}
                />
              )}
              
              {!isAdding && !editingStat && socialStats.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
                  <p className="text-muted-foreground">No social statistics added yet. Add some to display on your homepage.</p>
                </div>
              )}
              
              {!isAdding && !editingStat && socialStats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {socialStats.map((stat) => (
                    <SocialStatItem
                      key={stat.id}
                      stat={stat}
                      onEdit={() => handleEditClick(stat)}
                      onDelete={() => handleDeleteStat(stat.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialStatisticsEditor;
