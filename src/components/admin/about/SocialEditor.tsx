
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  useSocialMedia, 
  useCreateSocialPlatform, 
  useUpdateSocialPlatform,
  useDeleteSocialPlatform 
} from '@/hooks/api/useSocialMedia';
import { SocialPlatformData } from '@/components/home/about/types';
import PlatformForm from './social/PlatformForm';
import PlatformList from './social/PlatformList';
import SaveOrderButton from './social/SaveOrderButton';

const SocialEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: socialPlatforms, isLoading } = useSocialMedia();
  const createPlatformMutation = useCreateSocialPlatform();
  const updatePlatformMutation = useUpdateSocialPlatform();
  const deletePlatformMutation = useDeleteSocialPlatform();
  
  const [platforms, setPlatforms] = useState<SocialPlatformData[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPlatform, setEditedPlatform] = useState<Partial<SocialPlatformData>>({});
  const [newPlatform, setNewPlatform] = useState<Partial<SocialPlatformData>>({
    name: '',
    url: '',
    icon: 'Instagram',
    color: 'pink',
    sort_order: 0
  });
  
  // Load data from database
  useEffect(() => {
    if (socialPlatforms) {
      setPlatforms(socialPlatforms);
    }
  }, [socialPlatforms]);
  
  const savePlatforms = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        platforms.map(async (platform, index) => {
          if (platform.sort_order !== index) {
            await updatePlatformMutation.mutateAsync({
              id: platform.id,
              updates: { sort_order: index }
            });
          }
        })
      );
      
      toast({
        title: 'Success',
        description: 'Social platforms saved successfully'
      });
    } catch (error) {
      console.error('Error saving social platforms:', error);
      toast({
        title: 'Error',
        description: 'Failed to save social platforms',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const addPlatform = async () => {
    if (!newPlatform.name || !newPlatform.url || !newPlatform.icon) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Set the sort order to be next in the list
      const sortOrder = platforms.length;
      const platformToAdd = {
        ...newPlatform,
        sort_order: sortOrder
      };
      
      await createPlatformMutation.mutateAsync(platformToAdd as Omit<SocialPlatformData, 'id'>);
      
      setNewPlatform({
        name: '',
        url: '',
        icon: 'Instagram',
        color: 'pink',
        sort_order: 0
      });
      
      setIsAddingNew(false);
      
      toast({
        title: 'Success',
        description: 'Social platform added successfully'
      });
    } catch (error) {
      console.error('Error adding social platform:', error);
      toast({
        title: 'Error',
        description: 'Failed to add social platform',
        variant: 'destructive'
      });
    }
  };
  
  const startEditing = (platform: SocialPlatformData) => {
    setIsEditing(platform.id);
    setEditedPlatform({...platform});
  };
  
  const saveEdit = async () => {
    if (!isEditing || !editedPlatform.name || !editedPlatform.url) return;
    
    try {
      await updatePlatformMutation.mutateAsync({
        id: isEditing,
        updates: editedPlatform
      });
      
      setIsEditing(null);
      setEditedPlatform({});
      
      toast({
        title: 'Success',
        description: 'Social platform updated successfully'
      });
    } catch (error) {
      console.error('Error updating social platform:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social platform',
        variant: 'destructive'
      });
    }
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setEditedPlatform({});
  };
  
  const deletePlatform = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social platform?')) return;
    
    try {
      await deletePlatformMutation.mutateAsync(id);
      
      toast({
        title: 'Success',
        description: 'Social platform deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting social platform:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete social platform',
        variant: 'destructive'
      });
    }
  };
  
  const moveUp = async (index: number) => {
    if (index === 0) return;
    
    const newPlatforms = [...platforms];
    [newPlatforms[index], newPlatforms[index - 1]] = [newPlatforms[index - 1], newPlatforms[index]];
    
    try {
      // Update sort_order in database
      await updatePlatformMutation.mutateAsync({
        id: platforms[index].id,
        updates: { sort_order: index - 1 }
      });
      
      await updatePlatformMutation.mutateAsync({
        id: platforms[index - 1].id,
        updates: { sort_order: index }
      });
      
      setPlatforms(newPlatforms);
    } catch (error) {
      console.error('Error reordering platforms:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder platforms',
        variant: 'destructive'
      });
    }
  };
  
  const moveDown = async (index: number) => {
    if (index === platforms.length - 1) return;
    
    const newPlatforms = [...platforms];
    [newPlatforms[index], newPlatforms[index + 1]] = [newPlatforms[index + 1], newPlatforms[index]];
    
    try {
      // Update sort_order in database
      await updatePlatformMutation.mutateAsync({
        id: platforms[index].id,
        updates: { sort_order: index + 1 }
      });
      
      await updatePlatformMutation.mutateAsync({
        id: platforms[index + 1].id,
        updates: { sort_order: index }
      });
      
      setPlatforms(newPlatforms);
    } catch (error) {
      console.error('Error reordering platforms:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder platforms',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="animate-pulse h-8 w-1/3 bg-secondary rounded"></div>
            <div className="animate-pulse h-6 w-1/2 bg-secondary/70 rounded"></div>
            <div className="animate-pulse h-20 w-full bg-secondary/50 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Platforms</CardTitle>
          <CardDescription>
            Manage your social media platforms and links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Platform
            </Button>
          </div>
          
          {isAddingNew && (
            <PlatformForm
              platform={newPlatform}
              setPlatform={setNewPlatform}
              onSave={addPlatform}
              onCancel={() => setIsAddingNew(false)}
              isNew={true}
            />
          )}
          
          <PlatformList
            platforms={platforms}
            isEditing={isEditing}
            editedPlatform={editedPlatform}
            setEditedPlatform={setEditedPlatform}
            onEdit={startEditing}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onDelete={deletePlatform}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
          />
          
          {platforms.length > 0 && (
            <SaveOrderButton
              isSaving={isSaving}
              onClick={savePlatforms}
              disabled={platforms.length === 0}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialEditor;
