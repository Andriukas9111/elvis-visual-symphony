
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AccomplishmentsList from './accomplishments/AccomplishmentsList';
import AccomplishmentsForm from './accomplishments/AccomplishmentsForm';
import { useStats, useCreateStat, useUpdateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import useStatReordering from '@/hooks/useStatReordering';
import { Card, CardContent } from '@/components/ui/card';

const AccomplishmentsEditor: React.FC = () => {
  const [editingItem, setEditingItem] = useState<StatItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const { data: stats, isLoading, error } = useStats('accomplishments');
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  
  const {
    reorderItem,
    saveSortOrder,
    isSaving
  } = useStatReordering('accomplishments');

  const handleEdit = (stat: StatItem) => {
    setEditingItem(stat);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingItem({
      id: '',
      type: 'accomplishments',
      label: '',
      value: '',
      description: '',
      icon: 'Award',
      sort_order: stats ? stats.length : 0
    });
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteStat.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting stat:', error);
      }
    }
  };

  const handleSave = async (formData: StatItem) => {
    try {
      if (isAddingNew) {
        await createStat.mutateAsync(formData);
      } else {
        await updateStat.mutateAsync({
          id: formData.id,
          updates: formData
        });
      }
      setEditingItem(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving stat:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-8 bg-secondary/40 rounded animate-pulse w-1/4" />
            <div className="h-24 bg-secondary/20 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error loading accomplishments</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (editingItem || isAddingNew) {
    return (
      <AccomplishmentsForm
        stat={editingItem!}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={isAddingNew === true}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Key Accomplishments</h3>
        <Button onClick={handleAddNew} size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Accomplishment
        </Button>
      </div>
      
      <AccomplishmentsList stats={stats || []} />
    </div>
  );
};

export default AccomplishmentsEditor;
