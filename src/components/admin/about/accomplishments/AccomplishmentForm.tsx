
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { Accomplishment } from '@/components/home/about/types';
import { getIconByName, iconOptions } from '../../about/stats/IconSelector';

interface AccomplishmentFormProps {
  item: Partial<Accomplishment>;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  isNew?: boolean;
  title?: string;
}

const AccomplishmentForm: React.FC<AccomplishmentFormProps> = ({
  item,
  onSave,
  onCancel,
  onChange,
  isNew = false,
  title = 'Edit Accomplishment'
}) => {
  return (
    <Card className={isNew ? "mb-6" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${isNew ? 'new' : 'edit'}-title`}>Title</Label>
            <Input
              id={`${isNew ? 'new' : 'edit'}-title`}
              value={item.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Award Won"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${isNew ? 'new' : 'edit'}-date`}>Date</Label>
            <Input
              id={`${isNew ? 'new' : 'edit'}-date`}
              value={item.date || ''}
              onChange={(e) => onChange('date', e.target.value)}
              placeholder="e.g., June 2023"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isNew ? 'new' : 'edit'}-description`}>Description</Label>
          <Input
            id={`${isNew ? 'new' : 'edit'}-description`}
            value={item.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Brief description of the accomplishment"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isNew ? 'new' : 'edit'}-url`}>URL (optional)</Label>
          <Input
            id={`${isNew ? 'new' : 'edit'}-url`}
            value={item.url || ''}
            onChange={(e) => onChange('url', e.target.value)}
            placeholder="e.g., https://example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isNew ? 'new' : 'edit'}-url-text`}>URL Text (optional)</Label>
          <Input
            id={`${isNew ? 'new' : 'edit'}-url-text`}
            value={item.url_text || ''}
            onChange={(e) => onChange('url_text', e.target.value)}
            placeholder="e.g., Read more"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isNew ? 'new' : 'edit'}-icon`}>Icon</Label>
          <Select 
            value={item.icon_name || 'Award'} 
            onValueChange={(value) => onChange('icon_name', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(icon => (
                <SelectItem key={icon.value} value={icon.value}>
                  <div className="flex items-center gap-2">
                    <div className="bg-secondary/30 p-1 rounded-md">
                      {React.createElement(getIconByName(icon.value), { className: "h-4 w-4" })}
                    </div>
                    <span>{icon.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {isNew ? "Cancel" : <><X className="h-4 w-4 mr-2" />Cancel</>}
        </Button>
        <Button onClick={onSave}>
          {isNew ? "Save" : <><Save className="h-4 w-4 mr-2" />Save</>}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccomplishmentForm;
