
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import IconSelector from '../stats/IconSelector';
import { ExpertiseItem } from '@/hooks/api/useExpertise';

interface ExpertiseFormProps {
  item: ExpertiseItem;
  onSave: (item: ExpertiseItem) => void;
  onCancel: () => void;
  isNew: boolean;
  iconOptions: any[];
}

const ExpertiseForm: React.FC<ExpertiseFormProps> = ({
  item,
  onSave,
  onCancel,
  isNew,
  iconOptions
}) => {
  const [formData, setFormData] = useState<ExpertiseItem>({
    ...item,
  });

  const handleChange = (field: keyof ExpertiseItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>{isNew ? 'Add New' : 'Edit'} {formData.type === 'expertise' ? 'Expertise Area' : 'Project Type'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="label">Title</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
                required
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon_name}
                onValueChange={(value) => handleChange('icon_name', value)}
              >
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <IconSelector />
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sort_order">Display Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order.toString()}
                onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                min="0"
              />
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

export default ExpertiseForm;
