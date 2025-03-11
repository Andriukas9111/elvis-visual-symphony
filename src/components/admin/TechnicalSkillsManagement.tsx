
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Folder } from 'lucide-react';
import { TechnicalSkillData } from '@/components/home/about/types';
import AdminLoadingState from './AdminLoadingState';
import SkillsEditor from './technical-skills/SkillsEditor';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const TechnicalSkillsManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSkill, setEditingSkill] = useState<TechnicalSkillData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch technical skills from Supabase
  const {
    data: skills,
    isLoading,
    error
  } = useQuery({
    queryKey: ['technicalSkills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('category', { ascending: true });
        
      if (error) throw error;
      return data as TechnicalSkillData[];
    }
  });

  // Delete skill mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
      toast({
        title: 'Success',
        description: 'Skill category deleted successfully'
      });
    },
    onError: (error) => {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete skill category',
        variant: 'destructive'
      });
    }
  });

  const handleDeleteSkill = (id: string) => {
    if (confirm('Are you sure you want to delete this skill category?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditSkill = (skill: TechnicalSkillData) => {
    setEditingSkill(skill);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingSkill({
      id: '',
      name: '',
      category: '',
      proficiency: 0,
      skills: []
    });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    setEditingSkill(null);
    setIsAddingNew(false);
    queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setIsAddingNew(false);
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">Error loading technical skills</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  if (editingSkill || isAddingNew) {
    return (
      <SkillsEditor
        skill={editingSkill!}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={isAddingNew}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Technical Skills Management</CardTitle>
          <CardDescription>
            Manage your technical skills displayed in the About section
          </CardDescription>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </CardHeader>
      
      <CardContent>
        {skills && skills.length > 0 ? (
          <div className="space-y-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="border border-border">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">{skill.category}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSkill(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {skill.skills && skill.skills.map((item, index) => (
                      <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No technical skills found. Add your first skill category.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalSkillsManagement;
