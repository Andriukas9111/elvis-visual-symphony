
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import IconSelector from '../ui/IconSelector';
import SavedIndicator from '../ui/SavedIndicator';
import FormError from '../ui/FormError';

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

interface AccomplishmentFormProps {
  item: Accomplishment;
  onSave: (item: Accomplishment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMove: (id: string, direction: 'up' | 'down') => Promise<void>;
  items: Accomplishment[];
  isSubmitting: boolean;
}

const AccomplishmentForm: React.FC<AccomplishmentFormProps> = ({
  item,
  onSave,
  onDelete,
  onMove,
  items,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localItem, setLocalItem] = useState<Accomplishment>(item);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleChange = (field: keyof Accomplishment, value: string) => {
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
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this accomplishment?')) {
      try {
        setIsDeleting(true);
        await onDelete(item.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const itemIndex = items.findIndex(i => i.id === item.id);
  const isFirst = itemIndex === 0;
  const isLast = itemIndex === items.length - 1;
  
  return (
    <Card className="bg-elvis-medium">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove(item.id, 'up')}
              disabled={isFirst || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove(item.id, 'down')}
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
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isEditing ? (
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label htmlFor={`title-${item.id}`}>Title</Label>
              <Input
                id={`title-${item.id}`}
                value={localItem.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`value-${item.id}`}>Value</Label>
                <Input
                  id={`value-${item.id}`}
                  value={localItem.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
              <div>
                <Label htmlFor={`suffix-${item.id}`}>Suffix (optional)</Label>
                <Input
                  id={`suffix-${item.id}`}
                  value={localItem.suffix || ''}
                  onChange={(e) => handleChange('suffix', e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`icon-${item.id}`}>Icon</Label>
              <IconSelector
                value={localItem.icon}
                onChange={(value) => handleChange('icon', value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                    value={localItem.background_color}
                    onChange={(e) => handleChange('background_color', e.target.value)}
                    className="bg-elvis-dark"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`text-${item.id}`}>Text Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border border-white/20" 
                    style={{ backgroundColor: localItem.text_color }}
                  />
                  <Input
                    id={`text-${item.id}`}
                    type="text"
                    value={localItem.text_color}
                    onChange={(e) => handleChange('text_color', e.target.value)}
                    className="bg-elvis-dark"
                  />
                </div>
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
        </CardContent>
      ) : (
        <CardContent className="pt-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded flex items-center justify-center text-xl"
              style={{ backgroundColor: item.background_color, color: item.text_color }}
            >
              {item.icon.startsWith('lucide-') ? (
                <span className="iconPlaceholder">{item.icon}</span>
              ) : (
                <i className={item.icon}></i>
              )}
            </div>
            <div>
              <div className="font-semibold text-xl">{item.value}{item.suffix}</div>
              <div className="text-sm text-gray-400">{item.title}</div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const AccomplishmentsForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: accomplishments, isLoading } = useQuery({
    queryKey: ['accomplishments'],
    queryFn: async () => {
      console.log('Fetching accomplishments');
      try {
        const { data, error } = await supabase
          .from('accomplishments')
          .select('*')
          .order('order_index');
          
        if (error) {
          console.error('Error fetching accomplishments:', error);
          throw error;
        }
        
        console.log('Fetched accomplishments:', data);
        return data as Accomplishment[];
      } catch (error: any) {
        setError(`Failed to load accomplishments: ${error.message}`);
        throw error;
      }
    }
  });
  
  const createItemMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);
      
      try {
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
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to create new accomplishment: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
  
  const updateItemMutation = useMutation({
    mutationFn: async (item: Accomplishment) => {
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('accomplishments')
          .update({
            title: item.title,
            value: item.value,
            suffix: item.suffix,
            icon: item.icon,
            background_color: item.background_color,
            text_color: item.text_color
          })
          .eq('id', item.id)
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to update accomplishment: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      
      try {
        const { error } = await supabase
          .from('accomplishments')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return id;
      } catch (error: any) {
        setError(`Failed to delete accomplishment: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
  
  const moveItemMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
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
        
        setLastSaved(new Date());
        return { success: true };
      } catch (error: any) {
        setError(`Failed to reorder accomplishments: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
  
  const handleSaveItem = async (item: Accomplishment) => {
    await updateItemMutation.mutateAsync(item);
  };
  
  const handleDeleteItem = async (id: string) => {
    await deleteItemMutation.mutateAsync(id);
  };
  
  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    await moveItemMutation.mutateAsync({ id, direction });
  };
  
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
          <CardTitle>Key Accomplishments</CardTitle>
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
            Add Accomplishment
          </Button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {accomplishments?.map(item => (
            <AccomplishmentForm
              key={item.id}
              item={item}
              onSave={handleSaveItem}
              onDelete={handleDeleteItem}
              onMove={handleMoveItem}
              items={accomplishments}
              isSubmitting={isSubmitting}
            />
          ))}
          
          {accomplishments?.length === 0 && (
            <div className="col-span-3 py-8 text-center text-muted-foreground">
              No accomplishments found. Click the "Add Accomplishment" button to create your first item.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccomplishmentsForm;
