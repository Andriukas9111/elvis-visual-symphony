
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSelector, getIconByName } from './stats/IconSelector';
import { useStats, useUpdateStat, useCreateStat, useDeleteStat, StatItem } from '@/hooks/api/useStats';
import { Plus, Edit, Trash2, X, Check, Pencil, Save } from 'lucide-react';
import AdminLoadingState from '../AdminLoadingState';

const AccomplishmentsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: allStats, isLoading } = useStats();
  const updateStat = useUpdateStat();
  const createStat = useCreateStat();
  const deleteStat = useDeleteStat();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StatItem>>({
    icon_name: 'Award',
    label: '',
    value: 0,
    suffix: '',
    sort_order: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  // Filter stats that should appear in Key Accomplishments (not in Social Statistics)
  // This typically includes stats like Awards, Experience, Client Satisfaction
  const accomplishmentStats = allStats?.filter(
    stat => !['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name)
  ) || [];

  const handleInputChange = (key: keyof StatItem, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddNew = () => {
    setFormData({
      icon_name: 'Award',
      label: '',
      value: 0,
      suffix: '+',
      sort_order: accomplishmentStats.length
    });
    setIsAdding(true);
  };

  const handleSaveNew = async () => {
    try {
      if (!formData.label || formData.value === undefined) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await createStat.mutateAsync({
        icon_name: formData.icon_name!,
        label: formData.label,
        value: formData.value,
        suffix: formData.suffix || '',
        sort_order: formData.sort_order || 0
      });

      toast({
        title: "Success",
        description: "Accomplishment created successfully"
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to create accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (stat: StatItem) => {
    setIsEditing(stat.id);
    setFormData(stat);
  };

  const handleSaveEdit = async () => {
    try {
      if (!isEditing || !formData.label || formData.value === undefined) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await updateStat.mutateAsync({
        id: isEditing,
        updates: formData
      });

      toast({
        title: "Success",
        description: "Accomplishment updated successfully"
      });
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating accomplishment:", error);
      toast({
        title: "Error",
        description: "Failed to update accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this accomplishment?")) {
      try {
        await deleteStat.mutateAsync(id);
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

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Key Accomplishments</h2>
          <p className="text-sm text-muted-foreground">
            Manage your key accomplishments shown in the About section
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={isAdding} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Accomplishment
        </Button>
      </div>

      {isAdding && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Add New Accomplishment</CardTitle>
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
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNew}>
                Create Accomplishment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {accomplishmentStats.length > 0 ? (
          accomplishmentStats.map((stat) => (
            <Card key={stat.id} className="border border-border">
              {isEditing === stat.id ? (
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
                      onClick={() => setIsEditing(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
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
                        onClick={() => handleEdit(stat)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(stat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center py-12">
              <p className="text-muted-foreground">No accomplishments found. Add your first accomplishment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AccomplishmentsEditor;
