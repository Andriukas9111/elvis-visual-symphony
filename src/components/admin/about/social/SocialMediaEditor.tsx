import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSocialMedia } from '@/hooks/api/useSocialMedia';
import { useToast } from '@/components/ui/use-toast';
import SocialMediaList from './SocialMediaList';
import SocialMediaForm from './SocialMediaForm';
import AdminLoadingState from '../../AdminLoadingState';
import { getAllIcons } from '../stats/IconSelector';

const SocialMediaEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: socialMedia, isLoading, mutate } = useSocialMedia();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleCreate = async (newSocialMedia: any) => {
    try {
      await mutate([...(socialMedia || []), newSocialMedia]);
      toast({
        title: "Success",
        description: "Social media created successfully"
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating social media:", error);
      toast({
        title: "Error",
        description: "Failed to create social media",
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async (id: string, updates: any) => {
    try {
      const updatedSocialMedia = socialMedia?.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      await mutate(updatedSocialMedia, false);
      toast({
        title: "Success",
        description: "Social media updated successfully"
      });
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating social media:", error);
      toast({
        title: "Error",
        description: "Failed to update social media",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this social media?")) {
      try {
        const updatedSocialMedia = socialMedia?.filter(item => item.id !== id);
        await mutate(updatedSocialMedia, false);
        toast({
          title: "Success",
          description: "Social media deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting social media:", error);
        toast({
          title: "Error",
          description: "Failed to delete social media",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Social Media</h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Social Media
        </Button>
      </div>
      
      {isAdding && (
        <SocialMediaForm onCreate={handleCreate} onCancel={() => setIsAdding(false)} />
      )}
      
      {editingItem && (
        <SocialMediaForm
          item={editingItem}
          onUpdate={handleUpdate}
          onCancel={() => setEditingItem(null)}
        />
      )}
      
      <SocialMediaList
        socialMedia={socialMedia || []}
        onEdit={setEditingItem}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SocialMediaEditor;
