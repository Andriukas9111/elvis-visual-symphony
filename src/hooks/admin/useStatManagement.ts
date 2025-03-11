
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useStats, useCreateStat, useUpdateStat, useDeleteStat } from '@/hooks/api/useStats';
import { StatData } from '@/components/home/about/types';

export const useStatManagement = () => {
  const { toast } = useToast();
  const { data: stats, isLoading } = useStats();
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<StatData>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<StatData>>({
    label: '', // Initialize with empty string to satisfy the required property
    value: 0,
    icon_name: 'Activity',
    sort_order: 0
  });

  const handleEdit = (item: StatData) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem({});
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editedItem.label || editedItem.value === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateStat.mutateAsync({
        id: isEditing,
        updates: {
          ...editedItem,
          value: Number(editedItem.value),
          sort_order: editedItem.sort_order !== undefined ? Number(editedItem.sort_order) : 0
        }
      });
      
      toast({
        title: "Success",
        description: "Statistic updated successfully"
      });
      
      setIsEditing(null);
      setEditedItem({});
    } catch (error) {
      console.error('Error updating statistic:', error);
      toast({
        title: "Error",
        description: "Failed to update statistic",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this statistic?')) {
      try {
        await deleteStat.mutateAsync(id);
        toast({
          title: "Success",
          description: "Statistic deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting statistic:', error);
        toast({
          title: "Error",
          description: "Failed to delete statistic",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = async () => {
    if (!newItem.label || newItem.value === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const itemToCreate: Omit<StatData, 'id'> = {
        label: newItem.label,
        value: Number(newItem.value),
        sort_order: newItem.sort_order !== undefined ? Number(newItem.sort_order) : 0,
        icon_name: newItem.icon_name || 'Activity',
      };
      
      await createStat.mutateAsync(itemToCreate);
      
      toast({
        title: "Success",
        description: "New statistic added successfully"
      });
      
      setIsAddingNew(false);
      setNewItem({
        label: '',
        value: 0,
        icon_name: 'Activity',
        sort_order: 0
      });
    } catch (error) {
      console.error('Error adding statistic:', error);
      toast({
        title: "Error",
        description: "Failed to add statistic",
        variant: "destructive"
      });
    }
  };

  const handleNewItemChange = (field: string, value: string | number) => {
    setNewItem({
      ...newItem,
      [field]: value
    });
  };

  const handleEditItemChange = (field: string, value: string | number) => {
    setEditedItem({
      ...editedItem,
      [field]: value
    });
  };

  return {
    stats,
    isLoading,
    isEditing,
    editedItem,
    isAddingNew,
    newItem,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    handleAddNew,
    handleNewItemChange,
    handleEditItemChange,
    setIsAddingNew
  };
};
