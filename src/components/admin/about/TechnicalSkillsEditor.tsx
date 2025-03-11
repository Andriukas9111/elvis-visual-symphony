
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { useTechnicalSkills, useCreateTechnicalSkill, useUpdateTechnicalSkill, useDeleteTechnicalSkill } from '@/hooks/api/useTechnicalSkills';
import { TechnicalSkillData } from '@/components/home/about/types';
import SkillForm from './skills/SkillForm';
import SkillList from './skills/SkillList';

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
            <SkillForm
              isAddingNew={true}
              skillData={newItem}
              onSave={handleAddNew}
              onCancel={() => setIsAddingNew(false)}
              onChangeData={setNewItem}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
            />
          )}

          <SkillList
            skillCategories={skillCategories || []}
            isEditing={isEditing}
            editedItem={editedItem}
            setEditedItem={setEditedItem}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            editNewSkill={editNewSkill}
            setEditNewSkill={setEditNewSkill}
            onAddEditSkill={handleAddEditSkill}
            onRemoveEditSkill={handleRemoveEditSkill}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSkillsEditor;
