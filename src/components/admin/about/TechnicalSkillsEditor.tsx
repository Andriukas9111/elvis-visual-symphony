
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { useTechnicalSkills, useCreateTechnicalSkill, useUpdateTechnicalSkill, useDeleteTechnicalSkill } from '@/hooks/api/useTechnicalSkills';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getIconByName, iconOptions } from './stats/IconSelector';
import { TechnicalSkillData } from '@/components/home/about/types';

const TechnicalSkillsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: skillCategories, isLoading } = useTechnicalSkills();
  const createSkill = useCreateTechnicalSkill();
  const updateSkill = useUpdateTechnicalSkill();
  const deleteSkill = useDeleteTechnicalSkill();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<TechnicalSkillData>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<TechnicalSkillData>>({
    category: '',
    name: '',
    description: '',
    icon_name: 'Code',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [editNewSkill, setEditNewSkill] = useState('');

  const handleEdit = (item: TechnicalSkillData) => {
    setIsEditing(item.id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedItem({});
    setEditNewSkill('');
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editedItem.category) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateSkill.mutateAsync({
        id: isEditing,
        updates: editedItem
      });
      
      toast({
        title: "Success",
        description: "Technical skill updated successfully"
      });
      
      setIsEditing(null);
      setEditedItem({});
      setEditNewSkill('');
    } catch (error) {
      console.error('Error updating technical skill:', error);
      toast({
        title: "Error",
        description: "Failed to update technical skill",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill category?')) {
      try {
        await deleteSkill.mutateAsync(id);
        toast({
          title: "Success",
          description: "Technical skill deleted successfully"
        });
      } catch (error) {
        console.error('Error deleting technical skill:', error);
        toast({
          title: "Error",
          description: "Failed to delete technical skill",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = async () => {
    if (!newItem.category) {
      toast({
        title: "Validation Error",
        description: "Please enter a skill category",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSkill.mutateAsync(newItem as Omit<TechnicalSkillData, 'id'>);
      
      toast({
        title: "Success",
        description: "New technical skill added successfully"
      });
      
      setIsAddingNew(false);
      setNewItem({
        category: '',
        name: '',
        description: '',
        icon_name: 'Code',
        skills: []
      });
      setNewSkill('');
    } catch (error) {
      console.error('Error adding technical skill:', error);
      toast({
        title: "Error",
        description: "Failed to add technical skill",
        variant: "destructive"
      });
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    setNewItem({
      ...newItem,
      skills: [...(newItem.skills || []), newSkill.trim()]
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...(newItem.skills || [])];
    updatedSkills.splice(index, 1);
    setNewItem({
      ...newItem,
      skills: updatedSkills
    });
  };

  const handleAddEditSkill = () => {
    if (!editNewSkill.trim()) return;
    
    setEditedItem({
      ...editedItem,
      skills: [...(editedItem.skills || []), editNewSkill.trim()]
    });
    setEditNewSkill('');
  };

  const handleRemoveEditSkill = (index: number) => {
    const updatedSkills = [...(editedItem.skills || [])];
    updatedSkills.splice(index, 1);
    setEditedItem({
      ...editedItem,
      skills: updatedSkills
    });
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
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>
              Manage your technical skills displayed on the about page
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
                <CardTitle>Add New Skill Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-category">Category Name</Label>
                    <Input
                      id="new-category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      placeholder="e.g., Programming Languages"
                    />
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
                                {getIconByName(icon.value)}
                              </div>
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-description">Description (optional)</Label>
                  <Textarea
                    id="new-description"
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Brief description about this skill category"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., JavaScript)"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button type="button" onClick={handleAddSkill}>Add</Button>
                  </div>
                  
                  {newItem.skills && newItem.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newItem.skills.map((skill, index) => (
                        <div key={index} className="bg-secondary flex items-center gap-1 py-1 px-3 rounded-full">
                          <span>{skill}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 rounded-full"
                            onClick={() => handleRemoveSkill(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
            {skillCategories && skillCategories.length > 0 ? (
              skillCategories.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {isEditing === item.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-category-${item.id}`}>Category Name</Label>
                            <Input
                              id={`edit-category-${item.id}`}
                              value={editedItem.category}
                              onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`edit-icon-${item.id}`}>Icon</Label>
                            <Select 
                              value={editedItem.icon_name || 'Code'} 
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
                                        {getIconByName(icon.value)}
                                      </div>
                                      <span>{icon.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-description-${item.id}`}>Description (optional)</Label>
                          <Textarea
                            id={`edit-description-${item.id}`}
                            value={editedItem.description || ''}
                            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                            placeholder="Brief description about this skill category"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Skills</Label>
                          <div className="flex gap-2">
                            <Input
                              value={editNewSkill}
                              onChange={(e) => setEditNewSkill(e.target.value)}
                              placeholder="Add a skill (e.g., JavaScript)"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddEditSkill()}
                            />
                            <Button type="button" onClick={handleAddEditSkill}>Add</Button>
                          </div>
                          
                          {editedItem.skills && editedItem.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {editedItem.skills.map((skill, index) => (
                                <div key={index} className="bg-secondary flex items-center gap-1 py-1 px-3 rounded-full">
                                  <span>{skill}</span>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-4 w-4 rounded-full"
                                    onClick={() => handleRemoveEditSkill(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
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
                            {getIconByName(item.icon_name || 'Code', "h-5 w-5")}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{item.category}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.skills && item.skills.length} skills
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
                <p className="text-muted-foreground">No technical skills added yet. Add your first skill category to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSkillsEditor;
