
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContent, useUpdateContent, useCreateContent } from '@/hooks/api/useContent';
import AdminLoadingState from '../../AdminLoadingState';
import { IconSelector, getIconByName } from '../stats/IconSelector';
import { AccomplishmentData } from '@/components/home/about/types';

const AccomplishmentsEditor: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<AccomplishmentData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  
  const { data: contentData, isLoading } = useContent('accomplishments');
  const updateContent = useUpdateContent();
  const createContent = useCreateContent();
  
  const [formData, setFormData] = useState<Omit<AccomplishmentData, 'id'>>({
    value: '',
    label: '',
    icon_name: 'CheckCircle',
    color: 'from-pink-500/20 to-purple-500/20',
    sort_order: 0
  });
  
  // Get accomplishments from content data
  const accomplishments = React.useMemo(() => {
    if (!contentData || contentData.length === 0) return [];
    
    const accomplishmentsData = contentData.find(item => item.content && item.section === 'accomplishments');
    
    if (!accomplishmentsData || !accomplishmentsData.content) return [];
    
    try {
      return JSON.parse(accomplishmentsData.content) as AccomplishmentData[];
    } catch (error) {
      console.error("Error parsing accomplishments data:", error);
      return [];
    }
  }, [contentData]);
  
  const contentId = React.useMemo(() => {
    if (!contentData || contentData.length === 0) return null;
    
    const accomplishmentsData = contentData.find(item => item.section === 'accomplishments');
    return accomplishmentsData?.id || null;
  }, [contentData]);
  
  const handleEdit = (item: AccomplishmentData, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    setFormData({
      value: item.value,
      label: item.label,
      icon_name: item.icon_name,
      color: item.color,
      sort_order: item.sort_order
    });
    setIsEditing(true);
  };
  
  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
      try {
        const newAccomplishments = [...accomplishments];
        newAccomplishments.splice(index, 1);
        
        // Reorder remaining items
        const reorderedAccomplishments = newAccomplishments.map((item, idx) => ({
          ...item,
          sort_order: idx
        }));
        
        if (contentId) {
          await updateContent.mutateAsync({
            id: contentId,
            updates: {
              content: JSON.stringify(reorderedAccomplishments)
            }
          });
        }
        
        toast({
          title: 'Success',
          description: 'Accomplishment deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting accomplishment:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete accomplishment',
          variant: 'destructive'
        });
      }
    }
  };
  
  const handleUpdateOrder = async (index: number, direction: 'up' | 'down') => {
    if (index < 0 || 
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === accomplishments.length - 1)) {
      return;
    }
    
    const newAccomplishments = [...accomplishments];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items
    [newAccomplishments[index], newAccomplishments[targetIndex]] = 
    [newAccomplishments[targetIndex], newAccomplishments[index]];
    
    // Update sort_order values
    const reorderedAccomplishments = newAccomplishments.map((item, idx) => ({
      ...item,
      sort_order: idx
    }));
    
    try {
      if (contentId) {
        await updateContent.mutateAsync({
          id: contentId,
          updates: {
            content: JSON.stringify(reorderedAccomplishments)
          }
        });
        
        toast({
          title: 'Success',
          description: 'Order updated successfully'
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive'
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let newAccomplishments = [...accomplishments];
      
      if (isEditing && currentIndex !== null) {
        // Update existing item
        newAccomplishments[currentIndex] = {
          id: currentItem?.id || crypto.randomUUID(),
          ...formData
        };
      } else {
        // Add new item
        newAccomplishments.push({
          id: crypto.randomUUID(),
          ...formData,
          sort_order: accomplishments.length
        });
      }
      
      // Ensure sort_order is in sequence
      newAccomplishments = newAccomplishments.map((item, index) => ({
        ...item,
        sort_order: index
      }));
      
      if (contentId) {
        // Update existing content
        await updateContent.mutateAsync({
          id: contentId,
          updates: {
            content: JSON.stringify(newAccomplishments)
          }
        });
      } else {
        // Create new content
        await createContent.mutateAsync({
          section: 'accomplishments',
          content: JSON.stringify(newAccomplishments),
          is_published: true
        });
      }
      
      toast({
        title: 'Success',
        description: `Accomplishment ${isEditing ? 'updated' : 'added'} successfully`
      });
      
      // Reset form
      setFormData({
        value: '',
        label: '',
        icon_name: 'CheckCircle',
        color: 'from-pink-500/20 to-purple-500/20',
        sort_order: 0
      });
      setIsEditing(false);
      setCurrentItem(null);
      setCurrentIndex(null);
    } catch (error) {
      console.error('Error saving accomplishment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save accomplishment',
        variant: 'destructive'
      });
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setCurrentIndex(null);
    setFormData({
      value: '',
      label: '',
      icon_name: 'CheckCircle',
      color: 'from-pink-500/20 to-purple-500/20',
      sort_order: 0
    });
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Accomplishments</CardTitle>
          <CardDescription>
            Manage the key accomplishments displayed in the About section
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing || !accomplishments || accomplishments.length === 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="300+"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={e => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Projects Completed"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select 
                    value={formData.icon_name}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <IconSelector />
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Color Scheme</Label>
                  <Select 
                    value={formData.color}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="from-pink-500/20 to-purple-500/20">Pink to Purple</SelectItem>
                      <SelectItem value="from-blue-500/20 to-purple-500/20">Blue to Purple</SelectItem>
                      <SelectItem value="from-green-500/20 to-blue-500/20">Green to Blue</SelectItem>
                      <SelectItem value="from-yellow-500/20 to-orange-500/20">Yellow to Orange</SelectItem>
                      <SelectItem value="from-purple-500/20 to-pink-500/20">Purple to Pink</SelectItem>
                      <SelectItem value="from-blue-500/20 to-cyan-500/20">Blue to Cyan</SelectItem>
                      <SelectItem value="from-red-500/20 to-pink-500/20">Red to Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditing ? 'Update' : 'Add'} Accomplishment
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4">
                {accomplishments.map((item, index) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 flex items-center opacity-70 hover:opacity-100">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className={`glass-card rounded-xl border border-white/10 bg-gradient-to-br ${item.color} p-2 w-14 h-14 flex items-center justify-center`}>
                        <div className="text-xl font-bold text-white">{item.value}</div>
                      </div>
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {getIconByName(item.icon_name || 'CheckCircle')}
                          <span>{item.icon_name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex flex-col">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateOrder(index, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateOrder(index, 'down')}
                          disabled={index === accomplishments.length - 1}
                          className="h-7 w-7"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(item, index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Accomplishment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccomplishmentsEditor;
