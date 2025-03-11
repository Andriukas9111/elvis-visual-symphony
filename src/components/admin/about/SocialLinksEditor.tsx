
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, MoveUp, MoveDown, AlertCircle } from 'lucide-react';
import IconSelector from './IconSelector';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

const SocialLinksEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  
  const { data: links, isLoading, isError, error: fetchError } = useQuery({
    queryKey: ['social_links'],
    queryFn: async () => {
      console.log('Fetching social links');
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('order_index');
          
        if (error) {
          console.error('Error fetching social links:', error);
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length || 0} social links`);
        return data as SocialLink[];
      } catch (error) {
        console.error('Error in social links fetch function:', error);
        throw error;
      }
    }
  });
  
  useEffect(() => {
    // Log any fetch errors
    if (isError && fetchError) {
      console.error('Social links fetch error:', fetchError);
      setError((fetchError as Error).message);
    } else {
      setError(null);
    }
  }, [isError, fetchError]);
  
  const updateMutation = useMutation({
    mutationFn: async (linkData: Partial<SocialLink> & { id: string }) => {
      console.log('Updating social link:', linkData);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('social_links')
          .update(linkData)
          .eq('id', linkData.id)
          .select();
          
        if (error) {
          console.error('Error updating social link:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          throw new Error('No data returned from update');
        }
        
        return data[0];
      } catch (error) {
        console.error('Error in updateMutation function:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Social link updated successfully');
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
      toast({
        title: "Success",
        description: "Social link updated successfully",
      });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error updating social link:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to update social link: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating new social link');
      setError(null);
      
      try {
        // Calculate next order index
        const nextIndex = links?.length ? Math.max(...links.map(s => s.order_index || 0)) + 1 : 0;
        
        const newLink = {
          platform: 'New Social Platform',
          url: 'https://',
          icon: 'lucide-share',
          background_color: '#FF66FF',
          text_color: '#FFFFFF',
          order_index: nextIndex
        };
        
        const { data, error } = await supabase
          .from('social_links')
          .insert([newLink])
          .select();
          
        if (error) {
          console.error('Error creating social link:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          throw new Error('No data returned from insert');
        }
        
        return data[0];
      } catch (error) {
        console.error('Error in createMutation function:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Social link created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
      setEditMode(prev => ({ ...prev, [data.id]: true }));
      toast({
        title: "Success",
        description: "New social link created successfully",
      });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error creating social link:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to create new social link: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting social link:', id);
      setError(null);
      
      try {
        const { error } = await supabase
          .from('social_links')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting social link:', error);
          throw error;
        }
        
        return id;
      } catch (error) {
        console.error('Error in deleteMutation function:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Social link deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
      toast({
        title: "Success",
        description: "Social link deleted successfully",
      });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error deleting social link:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to delete social link: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      console.log('Reordering social link:', id, direction);
      setError(null);
      
      try {
        if (!links) return null;
        
        const currentIndex = links.findIndex(s => s.id === id);
        if (currentIndex === -1) return null;
        
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= links.length) return null;
        
        const currentLink = links[currentIndex];
        const targetLink = links[targetIndex];
        
        // Swap order_index values
        const updates = [
          { id: currentLink.id, order_index: targetLink.order_index },
          { id: targetLink.id, order_index: currentLink.order_index }
        ];
        
        // Update both items
        for (const update of updates) {
          const { error } = await supabase
            .from('social_links')
            .update({ order_index: update.order_index })
            .eq('id', update.id);
            
          if (error) {
            console.error('Error updating order:', error);
            throw error;
          }
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error in reorderMutation function:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Social links reordered successfully');
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error reordering social links:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to reorder social links: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const handleToggleEdit = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleInputChange = (id: string, field: keyof SocialLink, value: string | number) => {
    console.log('Input change:', id, field, value);
    const link = links?.find(s => s.id === id);
    if (!link) return;
    
    updateMutation.mutate({
      id,
      [field]: value
    });
  };
  
  const renderGrid = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-elvis-medium animate-pulse h-40" />
          ))}
        </div>
      );
    }
    
    if (!links || links.length === 0) {
      return (
        <Card className="bg-elvis-medium p-6 text-center">
          <p className="text-muted-foreground">No social links found. Add your first one above.</p>
        </Card>
      );
    }
    
    // Calculate the grid column sizes based on the number of links
    // Maximum of 6 links per row
    const totalLinks = links.length;
    const columnsPerRow = Math.min(6, totalLinks);
    const gridClass = `grid gap-4 grid-cols-1 ${
      columnsPerRow === 1 ? 'md:grid-cols-1' :
      columnsPerRow === 2 ? 'md:grid-cols-2' :
      columnsPerRow === 3 ? 'md:grid-cols-3' :
      columnsPerRow === 4 ? 'md:grid-cols-4' :
      columnsPerRow === 5 ? 'md:grid-cols-5' :
      'md:grid-cols-6'
    }`;
    
    return (
      <div className={gridClass}>
        {links.map(link => (
          <Card key={link.id} className="bg-elvis-medium">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{link.platform}</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => reorderMutation.mutate({ id: link.id, direction: 'up' })}
                    disabled={!links || links.indexOf(link) === 0 || reorderMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => reorderMutation.mutate({ id: link.id, direction: 'down' })}
                    disabled={!links || links.indexOf(link) === links.length - 1 || reorderMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleToggleEdit(link.id)}
                    className="h-8 w-8 p-0"
                  >
                    {editMode[link.id] ? "Done" : "Edit"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(link.id)}
                    disabled={deleteMutation.isPending}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {editMode[link.id] ? (
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`platform-${link.id}`}>Platform Name</Label>
                    <Input
                      id={`platform-${link.id}`}
                      value={link.platform}
                      onChange={(e) => handleInputChange(link.id, 'platform', e.target.value)}
                      className="bg-elvis-dark"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`url-${link.id}`}>URL</Label>
                    <Input
                      id={`url-${link.id}`}
                      value={link.url}
                      onChange={(e) => handleInputChange(link.id, 'url', e.target.value)}
                      className="bg-elvis-dark"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`icon-${link.id}`}>Icon</Label>
                    <IconSelector
                      value={link.icon}
                      onChange={(value) => handleInputChange(link.id, 'icon', value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`bg-${link.id}`}>Background Color</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-white/20" 
                          style={{ backgroundColor: link.background_color }}
                        />
                        <Input
                          id={`bg-${link.id}`}
                          type="text"
                          value={link.background_color}
                          onChange={(e) => handleInputChange(link.id, 'background_color', e.target.value)}
                          className="bg-elvis-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`text-${link.id}`}>Text Color</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-white/20" 
                          style={{ backgroundColor: link.text_color }}
                        />
                        <Input
                          id={`text-${link.id}`}
                          type="text"
                          value={link.text_color}
                          onChange={(e) => handleInputChange(link.id, 'text_color', e.target.value)}
                          className="bg-elvis-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="pt-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: link.background_color, color: link.text_color }}
                  >
                    <i className={link.icon}></i>
                  </div>
                  <div className="overflow-hidden text-ellipsis">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-elvis-pink hover:underline text-sm overflow-hidden text-ellipsis block"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Social Links</h3>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="bg-elvis-pink hover:bg-elvis-pink/90"
        >
          {createMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add Social Link
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h3 className="text-red-500 font-medium">Error</h3>
          </div>
          <p className="mt-1 text-sm text-red-400">{error}</p>
        </div>
      )}
      
      {renderGrid()}
    </div>
  );
};

export default SocialLinksEditor;
