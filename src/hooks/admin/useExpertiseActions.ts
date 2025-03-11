
import { useCreateExpertise, useUpdateExpertise, useDeleteExpertise, ExpertiseItem } from '@/hooks/api/useExpertise';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useExpertiseActions = () => {
  const createExpertise = useCreateExpertise();
  const updateExpertise = useUpdateExpertise();
  const deleteExpertise = useDeleteExpertise();
  const { toast } = useToast();
  
  const [editingItem, setEditingItem] = useState<ExpertiseItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddNew = (type: 'expertise' | 'project') => {
    setEditingItem({
      id: '',
      type,
      label: '',
      description: '',
      icon_name: type === 'expertise' ? 'Camera' : 'Film',
      sort_order: 0
    });
    setIsAddingNew(true);
  };

  const handleEdit = (item: ExpertiseItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteExpertise.mutateAsync(id);
        toast({
          title: "Success",
          description: "Item deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async (formData: ExpertiseItem) => {
    try {
      if (isAddingNew) {
        // Remove the id field when creating a new item as it will be generated by the database
        const { id, ...newItem } = formData;
        await createExpertise.mutateAsync(newItem);
        toast({
          title: "Success",
          description: "New item created successfully"
        });
      } else {
        await updateExpertise.mutateAsync({
          id: formData.id,
          updates: formData
        });
        toast({
          title: "Success",
          description: "Item updated successfully"
        });
      }
      setEditingItem(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive"
      });
    }
  };

  return {
    editingItem,
    isAddingNew,
    handleAddNew,
    handleEdit,
    handleCancel,
    handleDelete,
    handleSave
  };
};
