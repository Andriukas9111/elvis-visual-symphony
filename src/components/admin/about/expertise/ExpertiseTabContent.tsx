
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import IconSelector from '../IconSelector';

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

const ExpertiseTabContent: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  
  const { data: items, isLoading } = useQuery({
    queryKey: ['expertise_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise_items')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ExpertiseItem[];
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (itemData: Partial<ExpertiseItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('expertise_items')
        .update(itemData)
        .eq('id', itemData.id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
      toast({
        title: "Success",
        description: "Expertise item updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating expertise item:", error);
      toast({
        title: "Error",
        description: "Failed to update expertise item",
        variant: "destructive"
      });
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async () => {
      // Calculate next order index
      const nextIndex = items?.length ? Math.max(...items.map(s => s.order_index || 0)) + 1 : 0;
      
      const newItem = {
        title: 'New Expertise',
        description: 'Description of this expertise area',
        icon: 'lucide-zap',
        order_index: nextIndex
      };
      
      const { data, error } = await supabase
        .from('expertise_items')
        .insert([newItem])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
      setEditMode(prev => ({ ...prev, [data.id]: true }));
      toast({
        title: "Success",
        description: "New expertise item created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating expertise item:", error);
      toast({
        title: "Error",
        description: "Failed to create new expertise item",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expertise_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
      toast({
        title: "Success",
        description: "Expertise item deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting expertise item:", error);
      toast({
        title: "Error",
        description: "Failed to delete expertise item",
        variant: "destructive"
      });
    }
  });
  
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      if (!items) return null;
      
      const currentIndex = items.findIndex(s => s.id === id);
      if (currentIndex === -1) return null;
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return null;
      
      const currentItem = items[currentIndex];
      const targetItem = items[targetIndex];
      
      // Swap order_index values
      const updates = [
        { id: currentItem.id, order_index: targetItem.order_index },
        { id: targetItem.id, order_index: currentItem.order_index }
      ];
      
      // Update both items
      for (const update of updates) {
        const { error } = await supabase
          .from('expertise_items')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
    },
    onError: (error) => {
      console.error("Error reordering expertise items:", error);
      toast({
        title: "Error",
        description: "Failed to reorder expertise items",
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
  
  const handleInputChange = (id: string, field: keyof ExpertiseItem, value: string | number) => {
    const item = items?.find(s => s.id === id);
    if (!item) return;
    
    updateMutation.mutate({
      id,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Expertise Areas</h3>
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
          Add Expertise
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-elvis-medium animate-pulse h-64" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {items?.map(item => (
            <Card key={item.id} className="bg-elvis-medium">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: item.id, direction: 'up' })}
                      disabled={!items || items.indexOf(item) === 0 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: item.id, direction: 'down' })}
                      disabled={!items || items.indexOf(item) === items.length - 1 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleEdit(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      {editMode[item.id] ? "Done" : "Edit"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {editMode[item.id] ? (
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`title-${item.id}`}>Title</Label>
                      <Input
                        id={`title-${item.id}`}
                        value={item.title}
                        onChange={(e) => handleInputChange(item.id, 'title', e.target.value)}
                        className="bg-elvis-dark"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${item.id}`}>Description</Label>
                      <Textarea
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                        className="bg-elvis-dark min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`icon-${item.id}`}>Icon</Label>
                      <IconSelector
                        value={item.icon}
                        onChange={(value) => handleInputChange(item.id, 'icon', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-elvis-pink flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-xl`}></i>
                    </div>
                    <div>
                      <p className="text-white/70 line-clamp-3">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertiseTabContent;
