
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  useSocialMedia, 
  useCreateSocialPlatform, 
  useUpdateSocialPlatform,
  useDeleteSocialPlatform 
} from '@/hooks/api/useSocialMedia';
import { SocialPlatformData } from '@/components/home/about/types';

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
            <div className="mb-6 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-4">Add New Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-2 block">Platform Name</Label>
                  <Input
                    id="name"
                    value={newPlatform.name || ''}
                    onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value})}
                    placeholder="Instagram"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="url" className="mb-2 block">Platform URL</Label>
                  <Input
                    id="url"
                    value={newPlatform.url || ''}
                    onChange={(e) => setNewPlatform({...newPlatform, url: e.target.value})}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="platform" className="mb-2 block">Platform Type</Label>
                  <Select
                    value={newPlatform.icon || ''}
                    onValueChange={(value) => {
                      const selected = platformOptions.find(p => p.value === value);
                      setNewPlatform({
                        ...newPlatform, 
                        icon: value,
                        color: selected?.color || 'gray'
                      });
                    }}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={addPlatform} variant="default">Add Platform</Button>
                <Button onClick={() => setIsAddingNew(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}
          
          {platforms.length > 0 ? (
            <div className="space-y-3">
              {platforms.map((platform, index) => (
                <div 
                  key={platform.id} 
                  className="p-4 border rounded-md flex items-start justify-between"
                >
                  {isEditing === platform.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <Label htmlFor={`edit-name-${platform.id}`} className="mb-1 block">Platform Name</Label>
                        <Input
                          id={`edit-name-${platform.id}`}
                          value={editedPlatform.name || ''}
                          onChange={(e) => setEditedPlatform({...editedPlatform, name: e.target.value})}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`edit-url-${platform.id}`} className="mb-1 block">Platform URL</Label>
                        <Input
                          id={`edit-url-${platform.id}`}
                          value={editedPlatform.url || ''}
                          onChange={(e) => setEditedPlatform({...editedPlatform, url: e.target.value})}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`edit-platform-${platform.id}`} className="mb-1 block">Platform Type</Label>
                        <Select
                          value={editedPlatform.icon || ''}
                          onValueChange={(value) => {
                            const selected = platformOptions.find(p => p.value === value);
                            setEditedPlatform({
                              ...editedPlatform, 
                              icon: value,
                              color: selected?.color || 'gray'
                            });
                          }}
                        >
                          <SelectTrigger id={`edit-platform-${platform.id}`}>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">{platform.url}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-1 shrink-0">
                    {isEditing === platform.id ? (
                      <>
                        <Button onClick={saveEdit} size="icon" variant="ghost">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={cancelEdit} size="icon" variant="ghost">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => moveUp(index)} 
                          size="icon" 
                          variant="ghost"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => moveDown(index)} 
                          size="icon" 
                          variant="ghost"
                          disabled={index === platforms.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => startEditing(platform)} size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => deletePlatform(platform.id)} size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No social media platforms added yet. Add your first platform to get started.</p>
            </div>
          )}
          
          {platforms.length > 0 && (
            <Button 
              onClick={savePlatforms} 
              disabled={isSaving}
              className="w-full mt-6"
            >
              {isSaving ? 'Saving...' : 'Save Platforms'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialEditor;
