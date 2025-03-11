
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicalSkill {
  id: string;
  name: string;
  proficiency: number;
  category_id: string;
  order_index: number;
}

interface SkillCategory {
  id: string;
  name: string;
  order_index: number;
}

const TechnicalSkillsTabContent: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(75);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  // Fetch Categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['skill_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as SkillCategory[];
    }
  });
  
  // Fetch Skills
  const { data: skills, isLoading: loadingSkills } = useQuery({
    queryKey: ['technical_skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as TechnicalSkill[];
    }
  });
  
  // Create new skill
  const createSkillMutation = useMutation({
    mutationFn: async () => {
      if (!newSkillName || !newSkillCategory) {
        throw new Error("Name and category are required");
      }
      
      // Calculate next order index
      const categorySkills = skills?.filter(s => s.category_id === newSkillCategory) || [];
      const nextIndex = categorySkills.length 
        ? Math.max(...categorySkills.map(s => s.order_index || 0)) + 1 
        : 0;
      
      const newSkill = {
        name: newSkillName,
        proficiency: newSkillProficiency,
        category_id: newSkillCategory,
        order_index: nextIndex
      };
      
      const { data, error } = await supabase
        .from('technical_skills')
        .insert([newSkill])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical_skills'] });
      setNewSkillName('');
      setNewSkillProficiency(75);
      setShowAddSkill(false);
      toast({
        title: "Success",
        description: "New skill created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating skill:", error);
      toast({
        title: "Error",
        description: "Failed to create new skill",
        variant: "destructive"
      });
    }
  });
  
  // Create new category
  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!newCategoryName) {
        throw new Error("Category name is required");
      }
      
      // Calculate next order index
      const nextIndex = categories?.length 
        ? Math.max(...categories.map(c => c.order_index || 0)) + 1 
        : 0;
      
      const newCategory = {
        name: newCategoryName,
        order_index: nextIndex
      };
      
      const { data, error } = await supabase
        .from('skill_categories')
        .insert([newCategory])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] });
      setNewCategoryName('');
      setShowAddCategory(false);
      toast({
        title: "Success",
        description: "New category created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create new category",
        variant: "destructive"
      });
    }
  });
  
  // Update skill
  const updateSkillMutation = useMutation({
    mutationFn: async (skillData: Partial<TechnicalSkill> & { id: string }) => {
      const { data, error } = await supabase
        .from('technical_skills')
        .update(skillData)
        .eq('id', skillData.id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical_skills'] });
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating skill:", error);
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive"
      });
    }
  });
  
  // Delete skill
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical_skills'] });
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive"
      });
    }
  });
  
  // Update category
  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: Partial<SkillCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('skill_categories')
        .update(categoryData)
        .eq('id', categoryData.id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  });
  
  // Delete category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      // First, check if category has skills
      const categorySkills = skills?.filter(s => s.category_id === id) || [];
      if (categorySkills.length > 0) {
        throw new Error("Can't delete category with skills. Remove skills first.");
      }
      
      const { error } = await supabase
        .from('skill_categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive"
      });
    }
  });
  
  const isLoading = loadingCategories || loadingSkills;
  
  const handleCategoryChange = (id: string, name: string) => {
    updateCategoryMutation.mutate({ id, name });
  };
  
  const handleSkillChange = (id: string, field: keyof TechnicalSkill, value: string | number) => {
    updateSkillMutation.mutate({
      id,
      [field]: value
    });
  };
  
  const getCategorySkills = (categoryId: string) => {
    return skills?.filter(skill => skill.category_id === categoryId) || [];
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="h-8 w-48 bg-elvis-medium rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-6 bg-elvis-medium rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between gap-4">
        <div>
          <Button
            onClick={() => setShowAddCategory(!showAddCategory)}
            variant="outline"
            className="mr-2"
          >
            {showAddCategory ? "Cancel" : "Add Category"}
          </Button>
          <Button
            onClick={() => {
              if (categories?.length === 0) {
                toast({
                  title: "Error",
                  description: "Create a category first before adding skills",
                  variant: "destructive"
                });
                return;
              }
              setShowAddSkill(!showAddSkill);
            }}
            variant="outline"
            className={categories?.length === 0 ? "opacity-50" : ""}
            disabled={categories?.length === 0}
          >
            {showAddSkill ? "Cancel" : "Add Skill"}
          </Button>
        </div>
      </div>
      
      {showAddCategory && (
        <Card className="bg-elvis-medium border-elvis-light">
          <CardHeader>
            <CardTitle className="text-lg">Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
              <Button
                onClick={() => createCategoryMutation.mutate()}
                disabled={!newCategoryName || createCategoryMutation.isPending}
                className="bg-elvis-pink hover:bg-elvis-pink/90 w-full"
              >
                {createCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showAddSkill && (
        <Card className="bg-elvis-medium border-elvis-light">
          <CardHeader>
            <CardTitle className="text-lg">Add New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="skill-name">Skill Name</Label>
                <Input
                  id="skill-name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="bg-elvis-dark"
                />
              </div>
              <div>
                <Label htmlFor="skill-category">Category</Label>
                <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                  <SelectTrigger className="bg-elvis-dark">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skill-proficiency">
                  Proficiency: {newSkillProficiency}%
                </Label>
                <Slider
                  id="skill-proficiency"
                  defaultValue={[75]}
                  min={0}
                  max={100}
                  step={1}
                  value={[newSkillProficiency]}
                  onValueChange={(val) => setNewSkillProficiency(val[0])}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={() => createSkillMutation.mutate()}
                disabled={!newSkillName || !newSkillCategory || createSkillMutation.isPending}
                className="bg-elvis-pink hover:bg-elvis-pink/90 w-full"
              >
                {createSkillMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-12">
        {categories?.map(category => (
          <div key={category.id} className="space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Input
                  value={category.name}
                  onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                  className="font-bold text-lg bg-transparent border-transparent focus-visible:border-elvis-light focus-visible:bg-elvis-medium w-auto min-w-[200px]"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCategoryMutation.mutate(category.id)}
                  disabled={deleteCategoryMutation.isPending}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {getCategorySkills(category.id).map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                        className="bg-transparent border-transparent focus-visible:border-elvis-light focus-visible:bg-elvis-medium"
                      />
                    </div>
                    <div className="flex items-center gap-1 w-36">
                      <Input 
                        type="number"
                        min={0}
                        max={100}
                        value={skill.proficiency}
                        onChange={(e) => handleSkillChange(skill.id, 'proficiency', parseInt(e.target.value))}
                        className="bg-elvis-dark w-16 text-right"
                      />
                      <span className="ml-1">%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSkillMutation.mutate(skill.id)}
                        disabled={deleteSkillMutation.isPending}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-elvis-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-elvis-pink rounded-full transition-all duration-300" 
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {getCategorySkills(category.id).length === 0 && (
                <div className="text-white/40 text-center py-4">
                  No skills in this category. Add some skills above.
                </div>
              )}
            </div>
          </div>
        ))}
        
        {categories?.length === 0 && (
          <div className="text-white/40 text-center py-8">
            No skill categories found. Add a category to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalSkillsTabContent;
