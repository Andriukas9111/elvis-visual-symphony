
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData } from '@/components/home/about/types';
import { getIconByName, iconOptions } from '../about/stats/IconSelector';

interface SkillsEditorProps {
  skill: TechnicalSkillData;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ 
  skill, 
  onSave, 
  onCancel, 
  isNew = false 
}) => {
  const { toast } = useToast();
  const [category, setCategory] = useState(skill.category);
  const [skills, setSkills] = useState<string[]>(skill.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconName, setIconName] = useState(skill.icon_name || 'Code');
  const [description, setDescription] = useState(skill.description || '');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      if (!category) {
        toast({
          title: 'Validation Error',
          description: 'Category is required',
          variant: 'destructive'
        });
        return;
      }
      
      const skillData = {
        category,
        skills,
        icon_name: iconName,
        description
      };
      
      if (isNew) {
        const { error } = await supabase
          .from('technical_skills')
          .insert(skillData);
          
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'New skill category added successfully'
        });
      } else {
        const { error } = await supabase
          .from('technical_skills')
          .update(skillData)
          .eq('id', skill.id);
          
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Skill category updated successfully'
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to save skill category',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Add New Skill Category' : 'Edit Skill Category'}</CardTitle>
        <CardDescription>
          {isNew 
            ? 'Create a new skill category with related skills'
            : 'Update this skill category and its associated skills'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category Name</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Software, Equipment, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon">Category Icon</Label>
          <Select 
            value={iconName} 
            onValueChange={setIconName}
          >
            <SelectTrigger id="icon" className="flex items-center gap-2">
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
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this skill category"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={skill} readOnly className="flex-1" />
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleRemoveSkill(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">Add Skill</Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., Adobe Premiere Pro"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleAddSkill}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillsEditor;
