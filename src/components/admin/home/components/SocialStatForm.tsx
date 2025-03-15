
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, X, Save } from 'lucide-react';
import { StatItem } from '@/hooks/api/useStats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { iconOptions } from '@/components/admin/about/stats/IconSelector';

interface SocialStatFormProps {
  initialData?: StatItem;
  onSave: (data: { title: string; value: string; icon: string }) => void;
  onCancel: () => void;
}

const SocialStatForm: React.FC<SocialStatFormProps> = ({ 
  initialData, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(initialData?.label || '');
  const [value, setValue] = useState(initialData?.value?.toString() || '');
  const [icon, setIcon] = useState(initialData?.icon_name || 'Users');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !value) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave({ title, value, icon });
    } catch (error) {
      console.error('Error in SocialStatForm:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 border border-elvis-pink/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Statistic Label</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Instagram Followers"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="value">Statistic Value</Label>
          <Input
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 10K+"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger id="icon">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {React.cloneElement(option.component, { className: "h-4 w-4" })}
                    <span>{option.value}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting || !title || !value}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SocialStatForm;
