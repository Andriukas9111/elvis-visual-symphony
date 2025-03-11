
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import IconSelector from './IconSelector';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SocialStat {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

const SocialStatsEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['socialStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_stats')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as SocialStat[];
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (statData: Partial<SocialStat> & { id: string }) => {
      const { data, error } = await supabase
        .from('social_stats')
        .update(statData)
        .eq('id', statData.id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
      toast({
        title: "Success",
        description: "Stat updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating stat:", error);
      toast({
        title: "Error",
        description: "Failed to update stat",
        variant: "destructive"
      });
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async () => {
      // Calculate next order index
      const nextIndex = stats?.length ? Math.max(...stats.map(s => s.order_index || 0)) + 1 : 0;
      
      const newStat = {
        title: 'New Statistic',
        value: '0',
        icon: 'lucide-star',
        background_color: '#FF66FF',
        text_color: '#FFFFFF',
        order_index: nextIndex
      };
      
      const { data, error } = await supabase
        .from('social_stats')
        .insert([newStat])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
      setEditMode(prev => ({ ...prev, [data.id]: true }));
      toast({
        title: "Success",
        description: "New stat created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating stat:", error);
      toast({
        title: "Error",
        description: "Failed to create new stat",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_stats')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
      toast({
        title: "Success",
        description: "Stat deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting stat:", error);
      toast({
        title: "Error",
        description: "Failed to delete stat",
        variant: "destructive"
      });
    }
  });
  
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      if (!stats) return null;
      
      const currentIndex = stats.findIndex(s => s.id === id);
      if (currentIndex === -1) return null;
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= stats.length) return null;
      
      const currentStat = stats[currentIndex];
      const targetStat = stats[targetIndex];
      
      // Swap order_index values
      const updates = [
        { id: currentStat.id, order_index: targetStat.order_index },
        { id: targetStat.id, order_index: currentStat.order_index }
      ];
      
      // Update both items
      for (const update of updates) {
        const { error } = await supabase
          .from('social_stats')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
    },
    onError: (error) => {
      console.error("Error reordering stats:", error);
      toast({
        title: "Error",
        description: "Failed to reorder stats",
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
  
  const handleInputChange = (id: string, field: keyof SocialStat, value: string | number) => {
    const stat = stats?.find(s => s.id === id);
    if (!stat) return;
    
    updateMutation.mutate({
      id,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Social Statistics</h3>
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
          Add Stat
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-elvis-medium animate-pulse h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {stats?.map(stat => (
            <Card key={stat.id} className="bg-elvis-medium">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{stat.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: stat.id, direction: 'up' })}
                      disabled={!stats || stats.indexOf(stat) === 0 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: stat.id, direction: 'down' })}
                      disabled={!stats || stats.indexOf(stat) === stats.length - 1 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleEdit(stat.id)}
                      className="h-8 w-8 p-0"
                    >
                      {editMode[stat.id] ? "Done" : "Edit"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteMutation.mutate(stat.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {editMode[stat.id] ? (
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`title-${stat.id}`}>Title</Label>
                        <Input
                          id={`title-${stat.id}`}
                          value={stat.title}
                          onChange={(e) => handleInputChange(stat.id, 'title', e.target.value)}
                          className="bg-elvis-dark"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`value-${stat.id}`}>Value</Label>
                        <Input
                          id={`value-${stat.id}`}
                          value={stat.value}
                          onChange={(e) => handleInputChange(stat.id, 'value', e.target.value)}
                          className="bg-elvis-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`subtitle-${stat.id}`}>Subtitle (optional)</Label>
                      <Input
                        id={`subtitle-${stat.id}`}
                        value={stat.subtitle || ''}
                        onChange={(e) => handleInputChange(stat.id, 'subtitle', e.target.value)}
                        className="bg-elvis-dark"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`icon-${stat.id}`}>Icon</Label>
                      <IconSelector
                        value={stat.icon}
                        onChange={(value) => handleInputChange(stat.id, 'icon', value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`bg-${stat.id}`}>Background Color</Label>
                        <div className="flex gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-white/20" 
                            style={{ backgroundColor: stat.background_color }}
                          />
                          <Input
                            id={`bg-${stat.id}`}
                            type="text"
                            value={stat.background_color}
                            onChange={(e) => handleInputChange(stat.id, 'background_color', e.target.value)}
                            className="bg-elvis-dark"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`text-${stat.id}`}>Text Color</Label>
                        <div className="flex gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-white/20" 
                            style={{ backgroundColor: stat.text_color }}
                          />
                          <Input
                            id={`text-${stat.id}`}
                            type="text"
                            value={stat.text_color}
                            onChange={(e) => handleInputChange(stat.id, 'text_color', e.target.value)}
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
                      style={{ backgroundColor: stat.background_color, color: stat.text_color }}
                    >
                      <i className={stat.icon}></i>
                    </div>
                    <div>
                      <div className="font-semibold text-xl">{stat.value}</div>
                      {stat.subtitle && <div className="text-sm text-gray-400">{stat.subtitle}</div>}
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

export default SocialStatsEditor;
