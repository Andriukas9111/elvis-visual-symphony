
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import IconSelector from '../ui/IconSelector';
import SavedIndicator from '../ui/SavedIndicator';
import FormError from '../ui/FormError';

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  background_color?: string;
  order_index: number;
}

const ExpertiseItemsForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: expertiseItems, isLoading } = useQuery({
    queryKey: ['expertise_items'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('expertise_items')
          .select('*')
          .order('order_index');
          
        if (error) throw error;
        return data as ExpertiseItem[];
      } catch (error: any) {
        setError(`Failed to load expertise items: ${error.message}`);
        throw error;
      }
    }
  });
  
  const createItemMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const nextIndex = expertiseItems?.length ? Math.max(...expertiseItems.map(s => s.order_index || 0)) + 1 : 0;
        
        const newItem = {
          title: 'New Expertise',
          description: 'Description of the expertise',
          icon: 'lucide-star',
          background_color: '#2A1E30',
          order_index: nextIndex
        };
        
        const { data, error } = await supabase
          .from('expertise_items')
          .insert([newItem])
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to create new expertise item: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: async (item: ExpertiseItem) => {
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('expertise_items')
          .update({
            title: item.title,
            description: item.description,
            icon: item.icon,
            background_color: item.background_color
          })
          .eq('id', item.id)
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to update expertise item: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      
      try {
        const { error } = await supabase
          .from('expertise_items')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return id;
      } catch (error: any) {
        setError(`Failed to delete expertise item: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
    }
  });
  
  const moveItemMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        if (!expertiseItems) return null;
        
        const currentIndex = expertiseItems.findIndex(s => s.id === id);
        if (currentIndex === -1) return null;
        
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= expertiseItems.length) return null;
        
        const currentItem = expertiseItems[currentIndex];
        const targetItem = expertiseItems[targetIndex];
        
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
        
        setLastSaved(new Date());
        return { success: true };
      } catch (error: any) {
        setError(`Failed to reorder expertise items: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise_items'] });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-elvis-pink" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Expertise Items</CardTitle>
          <SavedIndicator lastSaved={lastSaved} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormError error={error} />
        
        <div className="flex justify-end">
          <Button
            onClick={() => createItemMutation.mutate()}
            disabled={isSubmitting}
            className="bg-elvis-pink hover:bg-elvis-pink/90"
          >
            {createItemMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Expertise
          </Button>
        </div>
        
        <div className="space-y-4">
          {expertiseItems?.map((item, index) => (
            <ExpertiseItemCard
              key={item.id}
              item={item}
              onSave={(updatedItem) => updateItemMutation.mutate(updatedItem)}
              onDelete={() => {
                if (window.confirm('Are you sure you want to delete this expertise item?')) {
                  deleteItemMutation.mutate(item.id);
                }
              }}
              onMove={(direction) => moveItemMutation.mutate({ id: item.id, direction })}
              isFirst={index === 0}
              isLast={index === expertiseItems.length - 1}
              isSubmitting={isSubmitting}
            />
          ))}
          
          {expertiseItems?.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No expertise items found. Click the "Add Expertise" button to create your first item.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ExpertiseItemCardProps {
  item: ExpertiseItem;
  onSave: (item: ExpertiseItem) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
}

const ExpertiseItemCard: React.FC<ExpertiseItemCardProps> = ({
  item,
  onSave,
  onDelete,
  onMove,
  isFirst,
  isLast,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localItem, setLocalItem] = useState<ExpertiseItem>(item);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: keyof ExpertiseItem, value: any) => {
    setLocalItem(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(localItem);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="bg-elvis-medium">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove('up')}
              disabled={isFirst || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove('down')}
              disabled={isLast || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              disabled={isSubmitting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`title-${item.id}`}>Title</Label>
              <Input
                id={`title-${item.id}`}
                value={localItem.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            
            <div>
              <Label htmlFor={`description-${item.id}`}>Description</Label>
              <Textarea
                id={`description-${item.id}`}
                value={localItem.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            
            <div>
              <Label htmlFor={`icon-${item.id}`}>Icon</Label>
              <IconSelector
                value={localItem.icon}
                onChange={(value) => handleChange('icon', value)}
              />
            </div>
            
            <div>
              <Label htmlFor={`bg-${item.id}`}>Background Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border border-white/20" 
                  style={{ backgroundColor: localItem.background_color }}
                />
                <Input
                  id={`bg-${item.id}`}
                  type="text"
                  value={localItem.background_color || '#2A1E30'}
                  onChange={(e) => handleChange('background_color', e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
            </div>
            
            <div className="pt-3">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isSubmitting}
                className="w-full bg-elvis-pink hover:bg-elvis-pink/90"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: item.background_color || '#2A1E30', color: '#FFFFFF' }}
            >
              <i className={item.icon}></i>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-white/70">{item.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertiseItemsForm;
