
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContent, useUpdateContent, useCreateContent } from '@/hooks/api/useContent';
import AdminLoadingState from '../../AdminLoadingState';
import { iconOptions } from '../about/stats/IconSelector';

interface AccomplishmentItem {
  id: string;
  value: string;
  label: string;
  icon: string;
  color: string;
}

const AccomplishmentsEditor: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<AccomplishmentItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  
  const { data: contentData, isLoading } = useContent('accomplishments');
  const updateContent = useUpdateContent();
  const createContent = useCreateContent();
  
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    icon: 'CheckCircle',
    color: 'from-pink-500/20 to-purple-500/20'
  });
  
  // Get accomplishments from content data
  const accomplishments = React.useMemo(() => {
    if (!contentData || contentData.length === 0) return [];
    
    const accomplishmentsData = contentData.find(item => item.content && item.section === 'accomplishments');
    
    if (!accomplishmentsData || !accomplishmentsData.content) return [];
    
    try {
      return JSON.parse(accomplishmentsData.content) as AccomplishmentItem[];
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
  
  const handleEdit = (item: AccomplishmentItem, index: number) => {
    setCurrentItem(item);
    setCurrentIndex(index);
    setFormData({
      value: item.value,
      label: item.label,
      icon: item.icon,
      color: item.color
    });
    setIsEditing(true);
  };
  
  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
      try {
        const newAccomplishments = [...accomplishments];
        newAccomplishments.splice(index, 1);
        
        if (contentId) {
          await updateContent.mutateAsync({
            id: contentId,
            updates: {
              content: JSON.stringify(newAccomplishments)
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
          ...formData
        });
      }
      
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
        icon: 'CheckCircle',
        color: 'from-pink-500/20 to-purple-500/20'
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
      icon: 'CheckCircle',
      color: 'from-pink-500/20 to-purple-500/20'
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
                    value={formData.icon}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CheckCircle">Check Circle</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Calendar">Calendar</SelectItem>
                      <SelectItem value="Trophy">Trophy</SelectItem>
                      <SelectItem value="Star">Star</SelectItem>
                      <SelectItem value="Clock">Clock</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
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
                      <div className="w-10 cursor-move flex items-center opacity-70 hover:opacity-100">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="glass-card rounded-xl border border-white/10 bg-gradient-to-br p-2 w-14 h-14 flex items-center justify-center">
                        <div className="text-xl font-bold text-white">{item.value}</div>
                      </div>
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">Icon: {item.icon}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
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
