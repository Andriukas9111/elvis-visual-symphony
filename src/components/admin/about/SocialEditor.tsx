
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialPlatformData } from '@/components/home/about/types';
import PlatformForm from './social/PlatformForm';
import PlatformItem from './social/PlatformItem';
import AdminLoadingState from '../AdminLoadingState';

// Platform options
const platformOptions = [
  { value: 'Instagram', label: 'Instagram', color: 'pink' },
  { value: 'Youtube', label: 'YouTube', color: 'red' },
  { value: 'Twitter', label: 'Twitter', color: 'blue' },
  { value: 'Facebook', label: 'Facebook', color: 'blue' },
  { value: 'Linkedin', label: 'LinkedIn', color: 'blue' },
  { value: 'TikTok', label: 'TikTok', color: 'black' },
  { value: 'Pinterest', label: 'Pinterest', color: 'red' },
  { value: 'Behance', label: 'Behance', color: 'blue' },
];

const SocialEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for managing form and editing
  const [showForm, setShowForm] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Partial<SocialPlatformData>>({
    name: '',
    url: '',
    icon: '',
    color: ''
  });
  
  // Fetch platforms data
  const { data: platforms, isLoading } = useQuery({
    queryKey: ['social-platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_platforms')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as SocialPlatformData[];
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newPlatform: Omit<SocialPlatformData, 'id'>) => {
      const { data, error } = await supabase
        .from('social_platforms')
        .insert(newPlatform)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-platforms'] });
      toast({
        title: "Success",
        description: "Social platform added successfully"
      });
      setShowForm(false);
      setPlatform({ name: '', url: '', icon: '', color: '' });
    },
    onError: (error) => {
      console.error('Error creating platform:', error);
      toast({
        title: "Error",
        description: "Failed to add social platform",
        variant: "destructive"
      });
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<SocialPlatformData> }) => {
      const { data, error } = await supabase
        .from('social_platforms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-platforms'] });
      toast({
        title: "Success",
        description: "Social platform updated successfully"
      });
      setEditingPlatformId(null);
    },
    onError: (error) => {
      console.error('Error updating platform:', error);
      toast({
        title: "Error",
        description: "Failed to update social platform",
        variant: "destructive"
      });
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_platforms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-platforms'] });
      toast({
        title: "Success",
        description: "Social platform deleted successfully"
      });
    },
    onError: (error) => {
      console.error('Error deleting platform:', error);
      toast({
        title: "Error",
        description: "Failed to delete social platform",
        variant: "destructive"
      });
    }
  });
  
  // Reorder mutations
  const reorderMutation = useMutation({
    mutationFn: async (updatedPlatforms: SocialPlatformData[]) => {
      const updates = updatedPlatforms.map((platform, index) => ({
        id: platform.id,
        sort_order: index
      }));
      
      const promises = updates.map(update => 
        supabase
          .from('social_platforms')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      );
      
      await Promise.all(promises);
      return updatedPlatforms;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-platforms'] });
    },
    onError: (error) => {
      console.error('Error reordering platforms:', error);
      toast({
        title: "Error",
        description: "Failed to reorder platforms",
        variant: "destructive"
      });
    }
  });
  
  // Handle adding a new platform
  const handleAddNew = () => {
    setPlatform({
      name: '',
      url: '',
      icon: '',
      color: ''
    });
    setShowForm(true);
    setEditingPlatformId(null);
  };
  
  // Handle editing a platform
  const handleEdit = (platform: SocialPlatformData) => {
    setPlatform(platform);
    setEditingPlatformId(platform.id);
  };
  
  // Handle saving a platform
  const handleSave = () => {
    if (!platform.name || !platform.url || !platform.icon) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (editingPlatformId) {
      updateMutation.mutate({ 
        id: editingPlatformId, 
        updates: platform as SocialPlatformData 
      });
    } else {
      createMutation.mutate({
        ...platform as Required<Omit<SocialPlatformData, 'id'>>,
        sort_order: platforms?.length || 0
      });
    }
  };
  
  // Handle canceling
  const handleCancel = () => {
    setShowForm(false);
    setEditingPlatformId(null);
    setPlatform({ name: '', url: '', icon: '', color: '' });
  };
  
  // Handle deleting a platform
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this social platform?")) {
      deleteMutation.mutate(id);
    }
  };
  
  // Handle moving a platform up
  const handleMoveUp = (index: number) => {
    if (!platforms || index === 0) return;
    
    const newPlatforms = [...platforms];
    [newPlatforms[index], newPlatforms[index - 1]] = [newPlatforms[index - 1], newPlatforms[index]];
    reorderMutation.mutate(newPlatforms);
  };
  
  // Handle moving a platform down
  const handleMoveDown = (index: number) => {
    if (!platforms || index === platforms.length - 1) return;
    
    const newPlatforms = [...platforms];
    [newPlatforms[index], newPlatforms[index + 1]] = [newPlatforms[index + 1], newPlatforms[index]];
    reorderMutation.mutate(newPlatforms);
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Social Media Platforms</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Platform
        </Button>
      </div>
      
      {showForm && (
        <PlatformForm
          platform={platform}
          setPlatform={setPlatform}
          onSave={handleSave}
          onCancel={handleCancel}
          isNew={!editingPlatformId}
        />
      )}
      
      <div className="space-y-4">
        {platforms && platforms.length > 0 ? (
          platforms.map((platform, index) => (
            <PlatformItem
              key={platform.id}
              platform={platform}
              index={index}
              totalCount={platforms.length}
              isEditing={editingPlatformId === platform.id}
              editedPlatform={editingPlatformId === platform.id ? platform : {}}
              setEditedPlatform={setPlatform}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              platformOptions={platformOptions}
            />
          ))
        ) : (
          <div className="p-6 border rounded-md text-center">
            <p className="text-muted-foreground">No social platforms added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialEditor;
