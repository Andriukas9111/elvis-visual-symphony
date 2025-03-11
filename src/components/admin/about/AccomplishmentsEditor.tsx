
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import IconSelector from './IconSelector';

interface Accomplishment {
  id: string;
  title: string;
  value: string;
  suffix?: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

const AccomplishmentsEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  
  const { data: accomplishments, isLoading } = useQuery({
    queryKey: ['accomplishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accomplishments')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as Accomplishment[];
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (itemData: Partial<Accomplishment> & { id: string }) => {
      const { data, error } = await supabase
        .from('accomplishments')
        .update(itemData)
        .eq('id', itemData.id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
      toast({
        title: "Success",
        description: "Accomplishment updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to update accomplishment",
        variant: "destructive"
      });
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async () => {
      // Calculate next order index
      const nextIndex = accomplishments?.length ? Math.max(...accomplishments.map(s => s.order_index || 0)) + 1 : 0;
      
      const newItem = {
        title: 'New Accomplishment',
        value: '0',
        suffix: '+',
        icon: 'lucide-trophy',
        background_color: '#FF66FF',
        text_color: '#FFFFFF',
        order_index: nextIndex
      };
      
      const { data, error } = await supabase
        .from('accomplishments')
        .insert([newItem])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
      setEditMode(prev => ({ ...prev, [data.id]: true }));
      toast({
        title: "Success",
        description: "New accomplishment created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to create new accomplishment",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accomplishments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
      toast({
        title: "Success",
        description: "Accomplishment deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to delete accomplishment",
        variant: "destructive"
      });
    }
  });
  
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      if (!accomplishments) return null;
      
      const currentIndex = accomplishments.findIndex(s => s.id === id);
      if (currentIndex === -1) return null;
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= accomplishments.length) return null;
      
      const currentItem = accomplishments[currentIndex];
      const targetItem = accomplishments[targetIndex];
      
      // Swap order_index values
      const updates = [
        { id: currentItem.id, order_index: targetItem.order_index },
        { id: targetItem.id, order_index: currentItem.order_index }
      ];
      
      // Update both items
      for (const update of updates) {
        const { error } = await supabase
          .from('accomplishments')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    },
    onError: (error) => {
      console.error("Error reordering accomplishments:", error);
      toast({
        title: "Error",
        description: "Failed to reorder accomplishments",
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
  
  const handleInputChange = (id: string, field: keyof Accomplishment, value: string | number) => {
    const item = accomplishments?.find(s => s.id === id);
    if (!item) return;
    
    updateMutation.mutate({
      id,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Key Accomplishments</h3>
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
          Add Accomplishment
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="bg-elvis-medium animate-pulse h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {accomplishments?.map(item => (
            <Card key={item.id} className="bg-elvis-medium">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: item.id, direction: 'up' })}
                      disabled={!accomplishments || accomplishments.indexOf(item) === 0 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: item.id, direction: 'down' })}
                      disabled={!accomplishments || accomplishments.indexOf(item) === accomplishments.length - 1 || reorderMutation.isPending}
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
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`value-${item.id}`}>Value</Label>
                        <Input
                          id={`value-${item.id}`}
                          value={item.value}
                          onChange={(e) => handleInputChange(item.id, 'value', e.target.value)}
                          className="bg-elvis-dark"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`suffix-${item.id}`}>Suffix (optional)</Label>
                        <Input
                          id={`suffix-${item.id}`}
                          value={item.suffix || ''}
                          onChange={(e) => handleInputChange(item.id, 'suffix', e.target.value)}
                          className="bg-elvis-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`icon-${item.id}`}>Icon</Label>
                      <IconSelector
                        value={item.icon}
                        onChange={(value) => handleInputChange(item.id, 'icon', value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`bg-${item.id}`}>Background Color</Label>
                        <div className="flex gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-white/20" 
                            style={{ backgroundColor: item.background_color }}
                          />
                          <Input
                            id={`bg-${item.id}`}
                            type="text"
                            value={item.background_color}
                            onChange={(e) => handleInputChange(item.id, 'background_color', e.target.value)}
                            className="bg-elvis-dark"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`text-${item.id}`}>Text Color</Label>
                        <div className="flex gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-white/20" 
                            style={{ backgroundColor: item.text_color }}
                          />
                          <Input
                            id={`text-${item.id}`}
                            type="text"
                            value={item.text_color}
                            onChange={(e) => handleInputChange(item.id, 'text_color', e.target.value)}
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
                      className="w-12 h-12 rounded flex items-center justify-center text-xl"
                      style={{ backgroundColor: item.background_color, color: item.text_color }}
                    >
                      <i className={item.icon}></i>
                    </div>
                    <div>
                      <div className="font-semibold text-xl">{item.value}{item.suffix}</div>
                      <div className="text-sm text-gray-400">{item.title}</div>
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

export default AccomplishmentsEditor;
