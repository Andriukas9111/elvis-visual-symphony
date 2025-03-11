
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSelector } from '../stats/IconSelector';
import { StatItem, useCreateStat, useUpdateStat } from '@/hooks/api/useStats';

interface AccomplishmentsFormProps {
  formData: Partial<StatItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<StatItem>>>;
  onCancel: () => void;
  isEditing: string | null;
  accomplishmentsCount: number;
}

const AccomplishmentsForm: React.FC<AccomplishmentsFormProps> = ({
  formData,
  setFormData,
  onCancel,
  isEditing,
  accomplishmentsCount
}) => {
  const { toast } = useToast();
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();

  const handleInputChange = (key: keyof StatItem, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.label || formData.value === undefined) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      if (isEditing) {
        await updateStat.mutateAsync({
          id: isEditing,
          updates: formData
        });
        toast({
          title: "Success",
          description: "Accomplishment updated successfully"
        });
      } else {
        await createStat.mutateAsync({
          icon_name: formData.icon_name!,
          label: formData.label,
          value: formData.value,
          suffix: formData.suffix || '',
          sort_order: formData.sort_order || accomplishmentsCount
        });
        toast({
          title: "Success",
          description: "Accomplishment created successfully"
        });
      }
      onCancel();
    } catch (error) {
      console.error("Error saving accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to save accomplishment",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Accomplishment" : "Add New Accomplishment"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select
              value={formData.icon_name}
              onValueChange={(value) => handleInputChange('icon_name', value)}
            >
              <SelectTrigger id="icon">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                <IconSelector />
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={formData.label || ''}
              onChange={(e) => handleInputChange('label', e.target.value)}
              placeholder="e.g. Awards Won"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={formData.value?.toString() || '0'}
              onChange={(e) => handleInputChange('value', parseInt(e.target.value) || 0)}
              placeholder="e.g. 20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suffix">Suffix (optional)</Label>
            <Input
              id="suffix"
              value={formData.suffix || ''}
              onChange={(e) => handleInputChange('suffix', e.target.value)}
              placeholder="e.g. +, %, k"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update Accomplishment" : "Create Accomplishment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccomplishmentsForm;
