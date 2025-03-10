
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialPlatformData } from '@/components/home/about/types';
import { IconSelector } from '../stats/IconSelector';
import { getAllIcons } from '../stats/IconSelector';
import { ChromePicker } from 'react-color';

interface SocialMediaFormProps {
  link: SocialPlatformData;
  onSave: (link: SocialPlatformData) => void;
  onCancel: () => void;
  isNew: boolean;
}

// Predefined color gradients
const colorOptions = [
  { value: 'from-purple-500 to-pink-500', label: 'Instagram', sample: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { value: 'from-red-600 to-red-700', label: 'YouTube', sample: 'bg-gradient-to-r from-red-600 to-red-700' },
  { value: 'from-blue-400 to-blue-600', label: 'Twitter', sample: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { value: 'from-blue-600 to-blue-800', label: 'Facebook', sample: 'bg-gradient-to-r from-blue-600 to-blue-800' },
  { value: 'from-blue-700 to-blue-900', label: 'LinkedIn', sample: 'bg-gradient-to-r from-blue-700 to-blue-900' },
  { value: 'from-green-500 to-green-700', label: 'WhatsApp', sample: 'bg-gradient-to-r from-green-500 to-green-700' },
  { value: 'from-orange-500 to-pink-500', label: 'Warm', sample: 'bg-gradient-to-r from-orange-500 to-pink-500' },
  { value: 'from-blue-500 to-teal-500', label: 'Cool', sample: 'bg-gradient-to-r from-blue-500 to-teal-500' },
  { value: 'from-elvis-pink to-elvis-purple', label: 'Elvis', sample: 'bg-gradient-to-r from-elvis-pink to-elvis-purple' },
  { value: 'from-gray-700 to-gray-900', label: 'Dark', sample: 'bg-gradient-to-r from-gray-700 to-gray-900' },
];

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  link,
  onSave,
  onCancel,
  isNew
}) => {
  const [formData, setFormData] = useState<SocialPlatformData>({
    ...link,
  });
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState('#9b87f5');
  const allIcons = getAllIcons();

  const handleChange = (field: keyof SocialPlatformData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = allIcons[iconName] || allIcons['Link'];
    return IconComponent;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>{isNew ? 'Add New' : 'Edit'} Social Media Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Instagram, Twitter, etc."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => handleChange('icon', value)}
              >
                <SelectTrigger id="icon" className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    {React.cloneElement(getIconComponent(formData.icon) as React.ReactElement, { size: 16 })}
                    <SelectValue placeholder="Select an icon" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <IconSelector filterSocial={true} />
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Color Style</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomColor(true);
                  } else {
                    handleChange('color', value);
                    setShowCustomColor(false);
                  }
                }}
              >
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select color style" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${option.sample}`}></div>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Color</SelectItem>
                </SelectContent>
              </Select>

              {showCustomColor && (
                <div className="mt-2 p-2 border rounded-md">
                  <Label className="block mb-2">Choose Custom Color</Label>
                  <ChromePicker
                    color={customColor}
                    onChange={(color) => {
                      setCustomColor(color.hex);
                      handleChange('color', `from-[${color.hex}] to-[${color.hex}]`);
                    }}
                    disableAlpha
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sort_order">Display Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order?.toString() || "0"}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="mt-4 p-4 border rounded-md">
              <Label className="block mb-2">Preview</Label>
              <div className="flex items-center gap-3">
                <div 
                  className={`p-3 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${formData.color}`}
                >
                  {React.cloneElement(getIconComponent(formData.icon) as React.ReactElement, { size: 20 })}
                </div>
                <div>
                  <h4 className="font-medium">{formData.name || "Platform Name"}</h4>
                  <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                    {formData.url || "https://example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isNew ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialMediaForm;
