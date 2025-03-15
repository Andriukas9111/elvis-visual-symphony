
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
import IconSelector from '../stats/IconSelector';
import { StatItem, useCreateStat, useUpdateStat } from '@/hooks/api/useStats';

interface SocialStatisticsFormProps {
  formData: Partial<StatItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<StatItem>>>;
  onCancel: () => void;
  isEditing: string | null;
}

const SocialStatisticsForm: React.FC<SocialStatisticsFormProps> = ({
  formData,
  setFormData,
  onCancel,
  isEditing
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
          description: "Social statistic updated successfully"
        });
      } else {
        await createStat.mutateAsync({
          icon_name: formData.icon_name!,
          label: formData.label,
          value: formData.value,
          suffix: formData.suffix || '',
          sort_order: formData.sort_order || 0
        });
        toast({
          title: "Success",
          description: "Social statistic created successfully"
        });
      }
      onCancel();
    } catch (error) {
      console.error("Error saving social statistic:", error);
      toast({
        title: "Error",
        description: "Failed to save social statistic",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Social Statistic" : "Add New Social Statistic"}</CardTitle>
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
              placeholder="e.g. Projects"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={formData.value?.toString() || '0'}
              onChange={(e) => handleInputChange('value', parseInt(e.target.value) || 0)}
              placeholder="e.g. 100"
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
            {isEditing ? "Save Changes" : "Create Statistic"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialStatisticsForm;
