
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Link2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  useSocialMedia, 
  useCreateSocialMedia, 
  useUpdateSocialMedia, 
  useDeleteSocialMedia 
} from '@/hooks/api/useSocialMedia';
import AdminLoadingState from '../../AdminLoadingState';
import { SocialMedia } from '@/components/home/about/types';
import { getIconByName } from '../stats/IconSelector';

const SocialMediaEditor: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<SocialMedia | null>(null);
  
  const { data: socialMediaItems, isLoading } = useSocialMedia();
  const createSocialMedia = useCreateSocialMedia();
  const updateSocialMedia = useUpdateSocialMedia();
  const deleteSocialMedia = useDeleteSocialMedia();
  
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    color: '#000000',
    sort_order: 0
  });
  
  const handleEdit = (item: SocialMedia) => {
    setCurrentItem(item);
    setFormData({
      platform: item.platform,
      url: item.url,
      icon: item.icon,
      color: item.color,
      sort_order: item.sort_order
    });
    setIsEditing(true);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this social media link?')) {
      try {
        await deleteSocialMedia.mutateAsync(id);
        toast({
          title: 'Success',
          description: 'Social media link deleted successfully'
        });
      } catch (error) {
        console.error('Error deleting social media link:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete social media link',
          variant: 'destructive'
        });
      }
    }
  };
  
  const handleUpdateOrder = async (id: string, direction: 'up' | 'down') => {
    if (!socialMediaItems) return;
    
    const currentIndex = socialMediaItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === socialMediaItems.length - 1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentItem = socialMediaItems[currentIndex];
    const targetItem = socialMediaItems[targetIndex];
    
    try {
      await updateSocialMedia.mutateAsync({
        id: currentItem.id,
        updates: { sort_order: targetItem.sort_order }
      });
      
      await updateSocialMedia.mutateAsync({
        id: targetItem.id,
        updates: { sort_order: currentItem.sort_order }
      });
      
      toast({
        title: 'Success',
        description: 'Display order updated successfully'
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update display order',
        variant: 'destructive'
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentItem) {
        await updateSocialMedia.mutateAsync({
          id: currentItem.id,
          updates: formData
        });
        toast({
          title: 'Success',
          description: 'Social media link updated successfully'
        });
      } else {
        await createSocialMedia.mutateAsync({
          ...formData,
          sort_order: socialMediaItems?.length || 0
        });
        toast({
          title: 'Success',
          description: 'Social media link added successfully'
        });
      }
      
      // Reset form
      setFormData({
        platform: '',
        url: '',
        icon: '',
        color: '#000000',
        sort_order: 0
      });
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving social media link:', error);
      toast({
        title: 'Error',
        description: 'Failed to save social media link',
        variant: 'destructive'
      });
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({
      platform: '',
      url: '',
      icon: '',
      color: '#000000',
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
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Manage your social media profiles and contact links that display in the "Connect With Me" section
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing || !socialMediaItems || socialMediaItems.length === 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select 
                    value={formData.platform}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Vimeo">Vimeo</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">URL or Contact Info</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://instagram.com/yourusername or your@email.com"
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
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Youtube">YouTube</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Share2">TikTok</SelectItem>
                      <SelectItem value="Linkedin">LinkedIn</SelectItem>
                      <SelectItem value="Mail">Email</SelectItem>
                      <SelectItem value="Globe">Website</SelectItem>
                      <SelectItem value="Play">Vimeo</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Brand Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-14 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {isEditing ? 'Update' : 'Add'} Social Media Link
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4">
                {socialMediaItems.map(item => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                      >
                        {getIconByName(item.icon)}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.platform}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">{item.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex flex-col">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateOrder(item.id, 'up')}
                          disabled={socialMediaItems.indexOf(item) === 0}
                          className="h-7 w-7"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateOrder(item.id, 'down')}
                          disabled={socialMediaItems.indexOf(item) === socialMediaItems.length - 1}
                          className="h-7 w-7"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(item.id)}
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
                  Add New Social Media Link
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaEditor;
