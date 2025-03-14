
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useStats, useCreateStat, useUpdateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import { getAllIcons, iconOptionsGrouped } from '@/components/admin/about/stats/IconSelector';
import { 
  Plus, 
  Edit,
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  Check, 
  X, 
  Loader2
} from 'lucide-react';

const SocialStatisticsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: allStats, isLoading } = useStats();
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  
  // States
  const [stats, setStats] = useState<StatItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<StatItem>>({
    icon_name: 'Instagram',
    label: '',
    value: 0,
    suffix: '+',
    sort_order: 0,
    background_color: '#FF66FF',
    tab: 'social' // Set default tab to social
  });
  
  // Get all available icons
  const iconMap = getAllIcons();
  
  // Filter only social statistics
  useEffect(() => {
    if (allStats) {
      // First check for stats with tab='social'
      let socialStats = allStats.filter(stat => stat.tab === 'social');
      
      // If none found, use the social media platform icons as fallback
      if (socialStats.length === 0) {
        socialStats = allStats.filter(
          stat => ['Instagram', 'Youtube', 'Twitter', 'Facebook', 'TikTok', 'Linkedin', 'Eye', 'Heart', 'Users'].includes(stat.icon_name)
        );
      }
      
      // Sort by sort_order
      socialStats.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setStats(socialStats);
    }
  }, [allStats]);
  
  const colorOptions = [
    { value: '#FF66FF', label: 'Pink' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Yellow' },
    { value: '#EF4444', label: 'Red' },
    { value: '#6D28D9', label: 'Indigo' },
    { value: '#000000', label: 'Black' },
    { value: '#6B7280', label: 'Gray' },
    { value: '#EC4899', label: 'Hot Pink' },
    { value: '#14B8A6', label: 'Teal' }
  ];
  
  const handleEdit = (stat: StatItem) => {
    setFormData({
      ...stat,
      background_color: stat.background_color || '#FF66FF', // Provide default if missing
      tab: stat.tab || 'social' // Ensure tab is set
    });
    setEditingId(stat.id);
    setIsCreatingNew(false);
  };
  
  const handleAdd = () => {
    setFormData({
      icon_name: 'Instagram',
      label: '',
      value: 0,
      suffix: '+',
      sort_order: stats.length,
      background_color: '#FF66FF',
      tab: 'social' // Ensure new stats are tagged as social
    });
    setEditingId(null);
    setIsCreatingNew(true);
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setIsCreatingNew(false);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await deleteStat.mutateAsync(id);
        toast({
          title: 'Deleted successfully',
          description: 'The statistic has been removed.'
        });
      } catch (error) {
        console.error('Error deleting statistic:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete the statistic.',
          variant: 'destructive'
        });
      }
    }
  };
  
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    try {
      const currentStat = stats[index];
      const prevStat = stats[index - 1];
      
      await updateStat.mutateAsync({
        id: currentStat.id,
        updates: { sort_order: prevStat.sort_order }
      });
      
      await updateStat.mutateAsync({
        id: prevStat.id,
        updates: { sort_order: currentStat.sort_order }
      });
      
      toast({
        title: 'Success',
        description: 'Order updated successfully'
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive'
      });
    }
  };
  
  const handleMoveDown = async (index: number) => {
    if (index === stats.length - 1) return;
    try {
      const currentStat = stats[index];
      const nextStat = stats[index + 1];
      
      await updateStat.mutateAsync({
        id: currentStat.id,
        updates: { sort_order: nextStat.sort_order }
      });
      
      await updateStat.mutateAsync({
        id: nextStat.id,
        updates: { sort_order: currentStat.sort_order }
      });
      
      toast({
        title: 'Success',
        description: 'Order updated successfully'
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive'
      });
    }
  };
  
  const handleSave = async () => {
    try {
      if (!formData.label || formData.value === undefined) {
        toast({
          title: 'Missing data',
          description: 'Please complete all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      // Always set the tab to 'social' to ensure proper filtering
      const updatedData = {
        ...formData,
        tab: 'social'
      };
      
      if (editingId) {
        await updateStat.mutateAsync({
          id: editingId,
          updates: updatedData as StatItem
        });
        toast({
          title: 'Updated successfully',
          description: 'The statistic has been updated.'
        });
      } else {
        await createStat.mutateAsync(updatedData as Omit<StatItem, 'id'>);
        toast({
          title: 'Created successfully',
          description: 'The new statistic has been created.'
        });
      }
      
      setEditingId(null);
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Error saving statistic:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the statistic.',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Social Statistics</h2>
        {!isCreatingNew && !editingId && (
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Statistic
          </Button>
        )}
      </div>
      
      {/* Edit Form */}
      {(isCreatingNew || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Statistic' : 'Create New Statistic'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select 
                    value={formData.icon_name} 
                    onValueChange={(value) => setFormData({...formData, icon_name: value})}
                  >
                    <SelectTrigger id="icon" className="w-full">
                      <SelectValue placeholder="Select an icon">
                        {formData.icon_name && iconMap[formData.icon_name] && (
                          <div className="flex items-center gap-2">
                            {iconMap[formData.icon_name]}
                            <span>{formData.icon_name}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {iconOptionsGrouped.map((category) => (
                        <div key={category.category} className="mb-2">
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {category.category}
                          </div>
                          {category.icons.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center gap-2">
                                {icon.icon}
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="label">Label Text</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Instagram Followers"
                    value={formData.label || ''}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="100"
                    value={formData.value || ''}
                    onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    placeholder="e.g., +, K, M"
                    value={formData.suffix || ''}
                    onChange={(e) => setFormData({...formData, suffix: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Display Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    placeholder="0"
                    value={formData.sort_order || ''}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <Select 
                    value={formData.background_color || '#FF66FF'} 
                    onValueChange={(value) => setFormData({...formData, background_color: value})}
                  >
                    <SelectTrigger id="background_color" className="w-full">
                      <SelectValue placeholder="Select a color">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: formData.background_color }} 
                          />
                          {colorOptions.find(c => c.value === formData.background_color)?.label || 'Custom'}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: color.value }} 
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Stats List */}
      <div className="space-y-4">
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <Card key={stat.id} className="border-l-4" style={{ borderLeftColor: stat.background_color || '#FF66FF' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-md" style={{ backgroundColor: stat.background_color || '#FF66FF' }}>
                      {iconMap[stat.icon_name] || iconMap['Camera']}
                    </div>
                    <div>
                      <h3 className="font-medium">{stat.label}</h3>
                      <p className="text-2xl font-bold">
                        {stat.value}{stat.suffix}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={index === stats.length - 1}
                      onClick={() => handleMoveDown(index)}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(stat)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(stat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No social statistics found.</p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" /> Add Your First Statistic
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialStatisticsEditor;
