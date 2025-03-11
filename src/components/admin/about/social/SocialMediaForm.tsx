
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SocialPlatformData } from '@/components/home/about/types';
import { useToast } from '@/components/ui/use-toast';

interface SocialMediaFormProps {
  isEditing?: boolean;
  isNew?: boolean;
  editData?: SocialPlatformData;
  link?: SocialPlatformData;
  onCancel: () => void;
  onComplete: () => void;
  onSave: (formData: Partial<SocialPlatformData>) => Promise<void>;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ 
  isEditing = false,
  editData,
  link,
  onCancel,
  onComplete,
  onSave,
  isNew = false
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<SocialPlatformData>>({
    name: '',
    url: '',
    icon_name: 'Instagram',
    color: 'pink',
    sort_order: 0
  });
  
  // Load edit data if provided from either editData or link prop
  useEffect(() => {
    if (isEditing && editData) {
      setFormData(editData);
    } else if (link) {
      setFormData(link);
    }
  }, [isEditing, editData, link]);
  
  // Platform options
  const platformOptions = [
    { value: 'Instagram', label: 'Instagram', color: 'pink' },
    { value: 'Youtube', label: 'YouTube', color: 'red' },
    { value: 'Twitter', label: 'Twitter', color: 'blue' },
    { value: 'Facebook', label: 'Facebook', color: 'blue' },
    { value: 'Linkedin', label: 'LinkedIn', color: 'blue' },
    { value: 'TikTok', label: 'TikTok', color: 'black' },
    { value: 'Pinterest', label: 'Pinterest', color: 'red' },
    { value: 'Behance', label: 'Behance', color: 'blue' },
  ];
  
  const handleChange = (field: keyof SocialPlatformData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If changing platform type, also update the color
    if (field === 'icon_name') {
      const platform = platformOptions.find(p => p.value === value);
      if (platform) {
        setFormData(prev => ({ ...prev, color: platform.color }));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url || !formData.icon_name) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await onSave(formData);
      onComplete();
    } catch (error) {
      console.error('Error saving social platform:', error);
      toast({
        title: 'Error',
        description: 'Failed to save social platform',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="mb-2 block">Platform Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Instagram"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="url" className="mb-2 block">Platform URL</Label>
          <Input
            id="url"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://instagram.com/yourusername"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="platform" className="mb-2 block">Platform Type</Label>
          <Select
            value={formData.icon_name || ''}
            onValueChange={(value) => handleChange('icon_name', value)}
          >
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onCancel} variant="outline" type="button">Cancel</Button>
        <Button type="submit">
          {isEditing ? 'Update Platform' : 'Add Platform'}
        </Button>
      </div>
    </form>
  );
};

export default SocialMediaForm;
