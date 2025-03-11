import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Edit, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  useAccomplishments, 
  useCreateAccomplishment, 
  useUpdateAccomplishment, 
  useDeleteAccomplishment,
  Accomplishment
} from '@/hooks/api/useAccomplishments';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getIconByName, iconOptions } from '../about/stats/IconSelector';

const AccomplishmentsManagement: React.FC = () => {
  const { toast } = useToast();
  const { data: accomplishments, isLoading } = useAccomplishments();
  const createAccomplishment = useCreateAccomplishment();
  const updateAccomplishment = useUpdateAccomplishment();
  const deleteAccomplishment = useDeleteAccomplishment();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Accomplishment>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Accomplishment>>({
    label: '',
    value: 0,
    suffix: '',
    icon_name: 'Award',
    sort_order: 0
  });

  const handleEdit = (item: Accomplishment) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem({});
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editedItem.label || editedItem.value === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAccomplishment.mutateAsync({
        id: isEditing,
        updates: editedItem
      });
      
      toast({
        title: "Success",
        description: "Accomplishment updated successfully"
      });
      
      setIsEditing(null);
      setEditedItem({});
    } catch (error) {
      console.error('Error updating accomplishment:', error);
      toast({
        title: "Error",
        description: "Failed to update accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
      try {
        await deleteAccomplishment.mutateAsync(id);
        toast({
          title: "Success",
          description: "Accomplishment deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting accomplishment:', error);
        toast({
          title: "Error",
          description: "Failed to delete accomplishment",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = async () => {
    if (!newItem.label || newItem.value === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createAccomplishment.mutateAsync(newItem as Omit<Accomplishment, 'id'>);
      
      toast({
        title: "Success",
        description: "New accomplishment added successfully"
      });
      
      setIsAddingNew(false);
      setNewItem({
        label: '',
        value: 0,
        suffix: '',
        icon_name: 'Award',
        sort_order: 0
      });
    } catch (error) {
      console.error('Error adding accomplishment:', error);
      toast({
        title: "Error",
        description: "Failed to add accomplishment",
        variant: "destructive"
      });
    }
  };

  const handleMoveUp = async (item: Accomplishment, index: number) => {
    if (index === 0) return;
    
    try {
      const prevItem = accomplishments![index - 1];
      
      await Promise.all([
        updateAccomplishment.mutateAsync({
          id: item.id,
          updates: { sort_order: prevItem.sort_order }
        }),
        updateAccomplishment.mutateAsync({
          id: prevItem.id,
          updates: { sort_order: item.sort_order }
        })
      ]);
      
      toast({
        title: "Success",
        description: "Order updated successfully"
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (item: Accomplishment, index: number) => {
    if (!accomplishments || index === accomplishments.length - 1) return;
    
    try {
      const nextItem = accomplishments[index + 1];
      
      await Promise.all([
        updateAccomplishment.mutateAsync({
          id: item.id,
          updates: { sort_order: nextItem.sort_order }
        }),
        updateAccomplishment.mutateAsync({
          id: nextItem.id,
          updates: { sort_order: item.sort_order }
        })
      ]);
      
      toast({
        title: "Success",
        description: "Order updated successfully"
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
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
            <CardTitle>Key Accomplishments</CardTitle>
            <CardDescription>
              Manage the key accomplishments displayed on your about page
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
                <CardTitle>Add New Accomplishment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-label">Label</Label>
                    <Input
                      id="new-label"
                      value={newItem.label}
                      onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                      placeholder="e.g., Years Experience"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-value">Value</Label>
                      <Input
                        id="new-value"
                        type="number"
                        value={newItem.value}
                        onChange={(e) => setNewItem({ ...newItem, value: parseInt(e.target.value) })}
                        placeholder="e.g., 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-suffix">Suffix (optional)</Label>
                      <Input
                        id="new-suffix"
                        value={newItem.suffix || ''}
                        onChange={(e) => setNewItem({ ...newItem, suffix: e.target.value })}
                        placeholder="e.g., +"
                      />
                    </div>
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
            {accomplishments && accomplishments.length > 0 ? (
              accomplishments.map((item, index) => (
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
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-value-${item.id}`}>Value</Label>
                              <Input
                                id={`edit-value-${item.id}`}
                                type="number"
                                value={editedItem.value}
                                onChange={(e) => setEditedItem({ ...editedItem, value: parseInt(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-suffix-${item.id}`}>Suffix</Label>
                              <Input
                                id={`edit-suffix-${item.id}`}
                                value={editedItem.suffix || ''}
                                onChange={(e) => setEditedItem({ ...editedItem, suffix: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-icon-${item.id}`}>Icon</Label>
                          <Select 
                            value={editedItem.icon_name || 'Award'} 
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
                            {React.createElement(getIconByName(item.icon_name), { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">
                              {item.value}{item.suffix || ''}
                            </h3>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleMoveUp(item, index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleMoveDown(item, index)}
                            disabled={!accomplishments || index === accomplishments.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
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
                <p className="text-muted-foreground">No accomplishments added yet. Add your first one to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccomplishmentsManagement;
