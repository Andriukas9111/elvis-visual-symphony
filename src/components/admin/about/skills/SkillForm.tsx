
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getIconByName, iconOptions } from '../stats/IconSelector';
import { TechnicalSkillData } from '@/components/home/about/types';

interface SkillFormProps {
  isAddingNew: boolean;
  skillData: Partial<TechnicalSkillData>;
  onSave: () => void;
  onCancel: () => void;
  onChangeData: (data: Partial<TechnicalSkillData>) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({
  isAddingNew,
  skillData,
  onSave,
  onCancel,
  onChangeData,
  newSkill,
  setNewSkill,
  onAddSkill,
  onRemoveSkill
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isAddingNew ? 'Add New Skill Category' : 'Edit Skill Category'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category Name</Label>
            <Input
              id="category"
              value={skillData.category || ''}
              onChange={(e) => onChangeData({ ...skillData, category: e.target.value })}
              placeholder="e.g., Programming Languages"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select 
              value={skillData.icon_name || 'Code'} 
              onValueChange={(value) => onChangeData({ ...skillData, icon_name: value })}
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={skillData.description || ''}
            onChange={(e) => onChangeData({ ...skillData, description: e.target.value })}
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
              onKeyDown={(e) => e.key === 'Enter' && onAddSkill()}
            />
            <Button type="button" onClick={onAddSkill}>Add</Button>
          </div>
          
          {skillData.skills && skillData.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skillData.skills.map((skill, index) => (
                <div key={index} className="bg-secondary flex items-center gap-1 py-1 px-3 rounded-full">
                  <span>{skill}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 rounded-full"
                    onClick={() => onRemoveSkill(index)}
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillForm;
