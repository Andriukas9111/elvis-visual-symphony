
import React, { useEffect, useState } from 'react';
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

interface SocialStatFormProps {
  stat: SocialStat;
  onFieldChange: (id: string, field: keyof SocialStat, value: string) => void;
  onSave: (stat: SocialStat) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMove: (id: string, direction: 'up' | 'down') => Promise<void>;
  stats: SocialStat[];
  isSubmitting: boolean;
}

const SocialStatForm: React.FC<SocialStatFormProps> = ({
  stat,
  onFieldChange,
  onSave,
  onDelete,
  onMove,
  stats,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localStat, setLocalStat] = useState<SocialStat>(stat);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    setLocalStat(stat);
  }, [stat]);
  
  const handleChange = (field: keyof SocialStat, value: string) => {
    setLocalStat(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(localStat);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      try {
        setIsDeleting(true);
        await onDelete(stat.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const statIndex = stats.findIndex(s => s.id === stat.id);
  const isFirst = statIndex === 0;
  const isLast = statIndex === stats.length - 1;
  
  return (
    <Card className="bg-elvis-medium">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{stat.title}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove(stat.id, 'up')}
              disabled={isFirst || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove(stat.id, 'down')}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`title-${stat.id}`}>Title</Label>
                <Input
                  id={`title-${stat.id}`}
                  value={localStat.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
              <div>
                <Label htmlFor={`value-${stat.id}`}>Value</Label>
                <Input
                  id={`value-${stat.id}`}
                  value={localStat.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`subtitle-${stat.id}`}>Subtitle (optional)</Label>
              <Input
                id={`subtitle-${stat.id}`}
                value={localStat.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            <div>
              <Label htmlFor={`icon-${stat.id}`}>Icon</Label>
              <IconSelector
                value={localStat.icon}
                onChange={(value) => handleChange('icon', value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`bg-${stat.id}`}>Background Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border border-white/20" 
                    style={{ backgroundColor: localStat.background_color }}
                  />
                  <Input
                    id={`bg-${stat.id}`}
                    type="text"
                    value={localStat.background_color}
                    onChange={(e) => handleChange('background_color', e.target.value)}
                    className="bg-elvis-dark"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`text-${stat.id}`}>Text Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border border-white/20" 
                    style={{ backgroundColor: localStat.text_color }}
                  />
                  <Input
                    id={`text-${stat.id}`}
                    type="text"
                    value={localStat.text_color}
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
              style={{ backgroundColor: stat.background_color, color: stat.text_color }}
            >
              {stat.icon.startsWith('lucide-') ? (
                <span className="iconPlaceholder">{stat.icon}</span>
              ) : (
                <i className={stat.icon}></i>
              )}
            </div>
            <div>
              <div className="font-semibold text-xl">{stat.value}</div>
              {stat.subtitle && <div className="text-sm text-gray-400">{stat.subtitle}</div>}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const SocialStatsForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['socialStats'],
    queryFn: async () => {
      console.log('Fetching social stats');
      try {
        const { data, error } = await supabase
          .from('social_stats')
          .select('*')
          .order('order_index');
          
        if (error) {
          console.error('Error fetching social stats:', error);
          throw error;
        }
        
        console.log('Fetched social stats:', data);
        return data as SocialStat[];
      } catch (error: any) {
        setError(`Failed to load social stats: ${error.message}`);
        throw error;
      }
    }
  });
  
  const createStatMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);
      
      try {
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
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to create new stat: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
    }
  });
  
  const updateStatMutation = useMutation({
    mutationFn: async (stat: SocialStat) => {
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('social_stats')
          .update({
            title: stat.title,
            value: stat.value,
            subtitle: stat.subtitle,
            icon: stat.icon,
            background_color: stat.background_color,
            text_color: stat.text_color
          })
          .eq('id', stat.id)
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to update stat: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
    }
  });
  
  const deleteStatMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      
      try {
        const { error } = await supabase
          .from('social_stats')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return id;
      } catch (error: any) {
        setError(`Failed to delete stat: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
    }
  });
  
  const moveStatMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
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
        
        setLastSaved(new Date());
        return { success: true };
      } catch (error: any) {
        setError(`Failed to reorder stats: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
    }
  });
  
  const handleSaveStat = async (stat: SocialStat) => {
    await updateStatMutation.mutateAsync(stat);
  };
  
  const handleDeleteStat = async (id: string) => {
    await deleteStatMutation.mutateAsync(id);
  };
  
  const handleMoveStat = async (id: string, direction: 'up' | 'down') => {
    await moveStatMutation.mutateAsync({ id, direction });
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
          <CardTitle>Social Statistics</CardTitle>
          <SavedIndicator lastSaved={lastSaved} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormError error={error} />
        
        <div className="flex justify-end">
          <Button
            onClick={() => createStatMutation.mutate()}
            disabled={isSubmitting}
            className="bg-elvis-pink hover:bg-elvis-pink/90"
          >
            {createStatMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Stat
          </Button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {stats?.map(stat => (
            <SocialStatForm
              key={stat.id}
              stat={stat}
              onFieldChange={() => {}}
              onSave={handleSaveStat}
              onDelete={handleDeleteStat}
              onMove={handleMoveStat}
              stats={stats}
              isSubmitting={isSubmitting}
            />
          ))}
          
          {stats?.length === 0 && (
            <div className="col-span-2 py-8 text-center text-muted-foreground">
              No social stats found. Click the "Add Stat" button to create your first statistic.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialStatsForm;
