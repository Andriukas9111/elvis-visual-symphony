
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData } from '@/components/home/about/types';
import SkillsEditor from '../technical-skills/SkillsEditor';

const TechnicalSkillsEditor: React.FC = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<TechnicalSkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<TechnicalSkillData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Load skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);
  
  // Fetch skills from database
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('id');
        
      if (error) throw error;
      setSkills(data as TechnicalSkillData[]);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load technical skills',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (skill: TechnicalSkillData) => {
    setEditingSkill(skill);
    setIsCreating(false);
  };
  
  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill category? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', skillId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Skill category deleted successfully'
      });
      
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete skill category',
        variant: 'destructive'
      });
    }
  };
  
  const handleCreateNew = () => {
    setEditingSkill({
      id: '',
      category: '',
      skills: []
    });
    setIsCreating(true);
  };
  
  const handleSave = () => {
    fetchSkills();
    setEditingSkill(null);
    setIsCreating(false);
  };
  
  const handleCancel = () => {
    setEditingSkill(null);
    setIsCreating(false);
  };
  
  if (editingSkill) {
    return (
      <SkillsEditor 
        skill={editingSkill}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={isCreating}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>
              Manage technical skills that appear on your about page
            </CardDescription>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-secondary/30 rounded-md"></div>
              ))}
            </div>
          ) : skills.length > 0 ? (
            <div className="space-y-4">
              {skills.map(skill => (
                <Card key={skill.id} className="overflow-hidden">
                  <div className="flex items-start justify-between p-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{skill.category}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {skill.skills && skill.skills.map((s, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-secondary/50 text-xs rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(skill)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(skill.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">No technical skills added yet. Add your first skill category to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSkillsEditor;
