
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatformData } from '@/components/home/about/types';

interface PlatformOption {
  value: string;
  label: string;
  color: string;
}

interface PlatformFormProps {
  platform: Partial<SocialPlatformData>;
  setPlatform: React.Dispatch<React.SetStateAction<Partial<SocialPlatformData>>>;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}

const platformOptions: PlatformOption[] = [
  { value: 'Instagram', label: 'Instagram', color: 'pink' },
  { value: 'Youtube', label: 'YouTube', color: 'red' },
  { value: 'Twitter', label: 'Twitter', color: 'blue' },
  { value: 'Facebook', label: 'Facebook', color: 'blue' },
  { value: 'Linkedin', label: 'LinkedIn', color: 'blue' },
  { value: 'TikTok', label: 'TikTok', color: 'black' },
  { value: 'Pinterest', label: 'Pinterest', color: 'red' },
  { value: 'Behance', label: 'Behance', color: 'blue' },
];

const PlatformForm: React.FC<PlatformFormProps> = ({
  platform,
  setPlatform,
  onSave,
  onCancel,
  isNew
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    if (!platform.name || !platform.url || !platform.icon) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    onSave();
  };

  return (
    <div className="mb-6 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">{isNew ? 'Add New Platform' : 'Edit Platform'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="mb-2 block">Platform Name</Label>
          <Input
            id="name"
            value={platform.name || ''}
            onChange={(e) => setPlatform({...platform, name: e.target.value})}
            placeholder="Instagram"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="url" className="mb-2 block">Platform URL</Label>
          <Input
            id="url"
            value={platform.url || ''}
            onChange={(e) => setPlatform({...platform, url: e.target.value})}
            placeholder="https://instagram.com/yourusername"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="platform" className="mb-2 block">Platform Type</Label>
          <Select
            value={platform.icon || ''}
            onValueChange={(value) => {
              const selected = platformOptions.find(p => p.value === value);
              setPlatform({
                ...platform, 
                icon: value,
                color: selected?.color || 'gray'
              });
            }}
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
      
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={handleSave} variant="default">{isNew ? 'Add Platform' : 'Save Changes'}</Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default PlatformForm;
