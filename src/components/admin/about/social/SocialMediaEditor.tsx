
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSocialMedia, useCreateSocialPlatform, useUpdateSocialPlatform, useDeleteSocialPlatform } from '@/hooks/api/useSocialMedia';
import { useToast } from '@/components/ui/use-toast';
import SocialMediaList from './SocialMediaList';
import SocialMediaForm from './SocialMediaForm';
import AdminLoadingState from '../../AdminLoadingState';
import { getIconByName } from '../stats/IconSelector';
import { SocialPlatformData } from '@/components/home/about/types';

const SocialMediaEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: socialMedia, isLoading } = useSocialMedia();
  const createPlatform = useCreateSocialPlatform();
  const updatePlatform = useUpdateSocialPlatform();
  const deletePlatform = useDeleteSocialPlatform();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialPlatformData | null>(null);

  const handleCreate = async (newSocialMedia: Omit<SocialPlatformData, 'id'>) => {
    try {
      await createPlatform.mutateAsync(newSocialMedia);
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

  const handleUpdate = async (id: string, updates: Partial<SocialPlatformData>) => {
    try {
      await updatePlatform.mutateAsync({
        id,
        updates
      });
      
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
        await deletePlatform.mutateAsync(id);
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
        <h2 className="text-2xl font-semibold">Social Media</h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Social Media
        </Button>
      </div>
      
      {isAdding && (
        <SocialMediaForm 
          isNew={true}
          onSave={handleCreate}
          onCancel={() => setIsAdding(false)}
          onComplete={() => setIsAdding(false)}
        />
      )}
      
      {editingItem && (
        <SocialMediaForm
          isEditing={true}
          editData={editingItem}
          onSave={(formData) => handleUpdate(editingItem.id, formData)}
          onCancel={() => setEditingItem(null)}
          onComplete={() => setEditingItem(null)}
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
