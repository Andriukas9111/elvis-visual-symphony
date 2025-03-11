
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  useAccomplishments, 
  useCreateAccomplishment, 
  useUpdateAccomplishment, 
  useDeleteAccomplishment
} from '@/hooks/api/useAccomplishments';
import { Accomplishment } from '@/components/home/about/types';

export const useAccomplishmentManagement = () => {
  const { toast } = useToast();
  const { data: accomplishments, isLoading } = useAccomplishments();
  const createAccomplishment = useCreateAccomplishment();
  const updateAccomplishment = useUpdateAccomplishment();
  const deleteAccomplishment = useDeleteAccomplishment();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Accomplishment>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Accomplishment>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    icon_name: 'Award',
    sort_order: 0
  });

  const handleEdit = (item: Accomplishment) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem({});
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editedItem.title || !editedItem.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAccomplishment.mutateAsync({
        id: isEditing,
        updates: editedItem
      });
      
      toast({
        title: "Success",
        description: "Accomplishment updated successfully"
      });
      
      setIsEditing(null);
      setEditedItem({});
    } catch (error) {
      console.error('Error updating accomplishment:', error);
      toast({
        title: "Error",
        description: "Failed to update accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
      try {
        await deleteAccomplishment.mutateAsync(id);
        toast({
          title: "Success",
          description: "Accomplishment deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting accomplishment:', error);
        toast({
          title: "Error",
          description: "Failed to delete accomplishment",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = async () => {
    if (!newItem.title || !newItem.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createAccomplishment.mutateAsync(newItem as Omit<Accomplishment, 'id'>);
      
      toast({
        title: "Success",
        description: "New accomplishment added successfully"
      });
      
      setIsAddingNew(false);
      setNewItem({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        icon_name: 'Award',
        sort_order: 0
      });
    } catch (error) {
      console.error('Error adding accomplishment:', error);
      toast({
        title: "Error",
        description: "Failed to add accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleMoveUp = async (item: Accomplishment, index: number) => {
    if (index === 0 || !accomplishments) return;
    
    try {
      const prevItem = accomplishments[index - 1];
      
      await Promise.all([
        updateAccomplishment.mutateAsync({
          id: item.id,
          updates: { sort_order: prevItem.sort_order }
        }),
        updateAccomplishment.mutateAsync({
          id: prevItem.id,
          updates: { sort_order: item.sort_order }
        })
      ]);
      
      toast({
        title: "Success",
        description: "Order updated successfully"
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (item: Accomplishment, index: number) => {
    if (!accomplishments || index === accomplishments.length - 1) return;
    
    try {
      const nextItem = accomplishments[index + 1];
      
      await Promise.all([
        updateAccomplishment.mutateAsync({
          id: item.id,
          updates: { sort_order: nextItem.sort_order }
        }),
        updateAccomplishment.mutateAsync({
          id: nextItem.id,
          updates: { sort_order: item.sort_order }
        })
      ]);
      
      toast({
        title: "Success",
        description: "Order updated successfully"
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
    }
  };

  const handleNewItemChange = (field: string, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleEditItemChange = (field: string, value: string) => {
    setEditedItem(prev => ({ ...prev, [field]: value }));
  };

  return {
    accomplishments,
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
    handleMoveUp,
    handleMoveDown,
    handleNewItemChange,
    handleEditItemChange,
    setIsAddingNew
  };
};
