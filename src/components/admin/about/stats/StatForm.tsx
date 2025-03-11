
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { StatData } from '@/components/home/about/types';
import { getIconByName, iconOptions } from './IconSelector';

interface StatFormProps {
  item: Partial<StatData>;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string | number) => void;
  isNew?: boolean;
  title?: string;
}

const StatForm: React.FC<StatFormProps> = ({
  item,
  onSave,
  onCancel,
  onChange,
  isNew = false,
  title = 'Edit Statistic'
}) => {
  return (
    <Card className={isNew ? "mb-6" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${isNew ? 'new' : 'edit'}-label`}>Label</Label>
            <Input
              id={`${isNew ? 'new' : 'edit'}-label`}
              value={item.label || ''}
              onChange={(e) => onChange('label', e.target.value)}
              placeholder="e.g., Projects Completed"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${isNew ? 'new' : 'edit'}-value`}>Value</Label>
            <Input
              id={`${isNew ? 'new' : 'edit'}-value`}
              type="number"
              value={item.value?.toString() || '0'}
              onChange={(e) => onChange('value', Number(e.target.value))}
              placeholder="e.g., 150"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${isNew ? 'new' : 'edit'}-icon`}>Icon</Label>
          <Select 
            value={item.icon_name || 'Activity'} 
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
        
        <div className="space-y-2">
          <Label htmlFor={`${isNew ? 'new' : 'edit'}-sort-order`}>Sort Order</Label>
          <Input
            id={`${isNew ? 'new' : 'edit'}-sort-order`}
            type="number"
            value={item.sort_order?.toString() || '0'}
            onChange={(e) => onChange('sort_order', Number(e.target.value))}
            placeholder="e.g., 1"
          />
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

export default StatForm;
