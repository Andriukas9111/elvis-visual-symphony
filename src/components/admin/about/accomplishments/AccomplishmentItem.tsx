
import React, { useState } from 'react';
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
import IconSelector, { getIconByName } from '../stats/IconSelector';
import { StatItem, useUpdateStat, useDeleteStat } from '@/hooks/api/useStats';
import { Edit, Trash2 } from 'lucide-react';

interface AccomplishmentItemProps {
  stat: StatItem;
}

const AccomplishmentItem: React.FC<AccomplishmentItemProps> = ({ stat }) => {
  const { toast } = useToast();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<StatItem>>(stat);

  const handleInputChange = (key: keyof StatItem, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(stat);
  };

  const handleSaveEdit = async () => {
    try {
      if (!formData.label || formData.value === undefined) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await updateStat.mutateAsync({
        id: stat.id,
        updates: formData
      });

      toast({
        title: "Success",
        description: "Accomplishment updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to update accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this accomplishment?")) {
      try {
        await deleteStat.mutateAsync(stat.id);
        toast({
          title: "Success",
          description: "Accomplishment deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting accomplishment:", error);
        toast({
          title: "Error",
          description: "Failed to delete accomplishment",
          variant: "destructive"
        });
      }
    }
  };

  if (isEditing) {
    return (
      <Card key={stat.id} className="border border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-icon-${stat.id}`}>Icon</Label>
              <Select
                value={formData.icon_name}
                onValueChange={(value) => handleInputChange('icon_name', value)}
              >
                <SelectTrigger id={`edit-icon-${stat.id}`}>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <IconSelector />
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`edit-label-${stat.id}`}>Label</Label>
              <Input
                id={`edit-label-${stat.id}`}
                value={formData.label || ''}
                onChange={(e) => handleInputChange('label', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`edit-value-${stat.id}`}>Value</Label>
              <Input
                id={`edit-value-${stat.id}`}
                type="number"
                value={formData.value?.toString() || '0'}
                onChange={(e) => handleInputChange('value', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`edit-suffix-${stat.id}`}>Suffix (optional)</Label>
              <Input
                id={`edit-suffix-${stat.id}`}
                value={formData.suffix || ''}
                onChange={(e) => handleInputChange('suffix', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={stat.id} className="border border-border">
      <CardHeader className="py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/20 p-2 rounded">
            {getIconByName(stat.icon_name, "h-5 w-5")}
          </div>
          <CardTitle className="text-lg">{stat.label}</CardTitle>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold mr-4">
            {stat.value}{stat.suffix}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AccomplishmentItem;
