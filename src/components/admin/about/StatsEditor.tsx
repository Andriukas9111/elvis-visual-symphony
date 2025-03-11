import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { useStats, useCreateStat, useUpdateStat, useDeleteStat } from '@/hooks/api/useStats';
import { StatData } from '@/components/home/about/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getIconByName, iconOptions } from './stats/IconSelector';

const StatsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: stats, isLoading } = useStats();
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<StatData>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<StatData>>({
    label: '',
    value: '',
    icon_name: 'Activity',
    sort_order: 0
  });

  const handleEdit = (item: StatData) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem({});
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editedItem.label || !editedItem.value) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateStat.mutateAsync({
        id: isEditing,
        updates: editedItem
      });
      
      toast({
        title: "Success",
        description: "Statistic updated successfully"
      });
      
      setIsEditing(null);
      setEditedItem({});
    } catch (error) {
      console.error('Error updating statistic:', error);
      toast({
        title: "Error",
        description: "Failed to update statistic",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this statistic?')) {
      try {
        await deleteStat.mutateAsync(id);
        toast({
          title: "Success",
          description: "Statistic deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting statistic:', error);
        toast({
          title: "Error",
          description: "Failed to delete statistic",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = async () => {
    if (!newItem.label || !newItem.value) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createStat.mutateAsync(newItem as Omit<StatData, 'id'>);
      
      toast({
        title: "Success",
        description: "New statistic added successfully"
      });
      
      setIsAddingNew(false);
      setNewItem({
        label: '',
        value: '',
        icon_name: 'Activity',
        sort_order: 0
      });
    } catch (error) {
      console.error('Error adding statistic:', error);
      toast({
        title: "Error",
        description: "Failed to add statistic",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-300/20 rounded"></div>
        <div className="h-32 bg-gray-300/10 rounded"></div>
        <div className="h-32 bg-gray-300/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              Manage the statistics displayed on the about page
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingNew && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Statistic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-label">Label</Label>
                    <Input
                      id="new-label"
                      value={newItem.label}
                      onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                      placeholder="e.g., Projects Completed"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-value">Value</Label>
                    <Input
                      id="new-value"
                      value={newItem.value}
                      onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                      placeholder="e.g., 150+"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-icon">Icon</Label>
                  <Select 
                    value={newItem.icon_name} 
                    onValueChange={(value) => setNewItem({ ...newItem, icon_name: value })}
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
                  <Label htmlFor="new-sort-order">Sort Order</Label>
                  <Input
                    id="new-sort-order"
                    type="number"
                    value={newItem.sort_order?.toString() || '0'}
                    onChange={(e) => setNewItem({ ...newItem, sort_order: parseInt(e.target.value) })}
                    placeholder="e.g., 1"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNew}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="space-y-4">
            {stats && stats.length > 0 ? (
              stats.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {isEditing === item.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-label-${item.id}`}>Label</Label>
                            <Input
                              id={`edit-label-${item.id}`}
                              value={editedItem.label}
                              onChange={(e) => setEditedItem({ ...editedItem, label: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`edit-value-${item.id}`}>Value</Label>
                            <Input
                              id={`edit-value-${item.id}`}
                              value={editedItem.value}
                              onChange={(e) => setEditedItem({ ...editedItem, value: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-icon-${item.id}`}>Icon</Label>
                          <Select 
                            value={editedItem.icon_name || 'Activity'} 
                            onValueChange={(value) => setEditedItem({ ...editedItem, icon_name: value })}
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
                          <Label htmlFor={`edit-sort-order-${item.id}`}>Sort Order</Label>
                          <Input
                            id={`edit-sort-order-${item.id}`}
                            type="number"
                            value={editedItem.sort_order?.toString() || '0'}
                            onChange={(e) => setEditedItem({ ...editedItem, sort_order: parseInt(e.target.value) })}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-secondary p-3 rounded-full">
                            {React.createElement(getIconByName(item.icon_name || 'Activity'), { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{item.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              Value: {item.value}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No statistics added yet. Add your first statistic to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsEditor;
