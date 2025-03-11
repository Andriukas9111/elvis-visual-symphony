
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialPlatformData } from '@/components/home/about/types';
import SocialMediaForm from './SocialMediaForm';
import { getAllIcons } from '../stats/IconSelector';

// Social media link editor component
const SocialMediaEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingLink, setEditingLink] = useState<SocialPlatformData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const allIcons = getAllIcons();

  // Fetch social media links from Supabase
  const {
    data: socialLinks,
    isLoading,
    error
  } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      
      // Map database format to component format
      return data.map(link => ({
        id: link.id,
        platform: link.platform || link.name,
        name: link.name,
        url: link.url,
        icon: link.icon,
        color: link.color,
        sort_order: link.sort_order
      })) as SocialPlatformData[];
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newLink: Omit<SocialPlatformData, 'id'>) => {
      const { data, error } = await supabase
        .from('social_media')
        .insert({
          platform: newLink.platform,
          name: newLink.name,
          url: newLink.url,
          icon: newLink.icon,
          color: newLink.color,
          sort_order: newLink.sort_order || 0
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast({
        title: 'Success',
        description: 'Social media link added successfully'
      });
    },
    onError: (error) => {
      console.error('Error adding social media link:', error);
      toast({
        title: 'Error',
        description: 'Failed to add social media link',
        variant: 'destructive'
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (link: SocialPlatformData) => {
      const { data, error } = await supabase
        .from('social_media')
        .update({
          platform: link.platform,
          name: link.name,
          url: link.url,
          icon: link.icon,
          color: link.color,
          sort_order: link.sort_order || 0
        })
        .eq('id', link.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast({
        title: 'Success',
        description: 'Social media link updated successfully'
      });
    },
    onError: (error) => {
      console.error('Error updating social media link:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social media link',
        variant: 'destructive'
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_media')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast({
        title: 'Success',
        description: 'Social media link deleted successfully'
      });
    },
    onError: (error) => {
      console.error('Error deleting social media link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete social media link',
        variant: 'destructive'
      });
    }
  });

  const handleDeleteLink = (id: string) => {
    if (confirm('Are you sure you want to delete this social media link?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditLink = (link: SocialPlatformData) => {
    setEditingLink(link);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingLink({
      id: '',
      platform: '',
      name: '',
      url: '',
      icon: 'Instagram',
      color: 'from-purple-500 to-pink-500',
      sort_order: (socialLinks?.length || 0) + 1
    });
    setIsAddingNew(true);
  };

  const handleSave = async (formData: SocialPlatformData) => {
    try {
      if (isAddingNew) {
        await createMutation.mutateAsync(formData);
      } else {
        await updateMutation.mutateAsync(formData);
      }
      setEditingLink(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving social media link:', error);
    }
  };

  const handleCancel = () => {
    setEditingLink(null);
    setIsAddingNew(false);
  };

  if (editingLink || isAddingNew) {
    return (
      <SocialMediaForm
        link={editingLink!}
        onSave={handleSave}
        onCancel={handleCancel}
        onComplete={() => setEditingLink(null)}
        isNew={isAddingNew}
      />
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-secondary rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-secondary rounded"></div>
                    <div className="h-3 w-40 bg-secondary/70 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-secondary rounded-md"></div>
                  <div className="h-8 w-8 bg-secondary rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6 space-y-2">
            <p className="text-red-500">Error loading social media links</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['socialLinks'] })}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Manage your social media presence
          </CardDescription>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </CardHeader>
      
      <CardContent>
        {socialLinks && socialLinks.length > 0 ? (
          <div className="space-y-4">
            {socialLinks.map((link) => {
              // Find the proper icon component
              const IconComponent = allIcons.find(i => i.name === link.icon)?.component;
              
              return (
                <div 
                  key={link.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`p-2 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${link.color}`}
                    >
                      {IconComponent && React.createElement(IconComponent, { size: 16 })}
                    </div>
                    <div>
                      <h4 className="font-medium">{link.platform || link.name}</h4>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditLink(link)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No social media links found. Add your first social platform.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaEditor;
