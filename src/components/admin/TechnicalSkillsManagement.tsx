
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase';
import AdminLoadingState from './AdminLoadingState';

const TechnicalSkillsManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [technicalSkills, setTechnicalSkills] = useState<any[]>([]);
  const [editSkill, setEditSkill] = useState<any>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newSkills, setNewSkills] = useState('');
  
  const fetchTechnicalSkills = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('category', { ascending: true });
        
      if (error) throw error;
      setTechnicalSkills(data || []);
    } catch (error) {
      console.error('Error fetching technical skills:', error);
      toast.error('Failed to load technical skills');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddSkill = async () => {
    if (!newCategory || !newSkills) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const skillsArray = newSkills.split(',').map(s => s.trim()).filter(s => s);
      
      const { data, error } = await supabase
        .from('technical_skills')
        .insert([{
          category: newCategory,
          skills: skillsArray
        }])
        .select();
        
      if (error) throw error;
      
      toast.success('Technical skill category added successfully');
      setNewCategory('');
      setNewSkills('');
      fetchTechnicalSkills();
    } catch (error) {
      console.error('Error adding technical skill:', error);
      toast.error('Failed to add technical skill');
    }
  };
  
  const handleUpdateSkill = async () => {
    if (!editSkill || !editSkill.category || !editSkill.skills) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const skillsArray = typeof editSkill.skills === 'string' 
        ? editSkill.skills.split(',').map(s => s.trim()).filter(s => s)
        : editSkill.skills;
      
      const { error } = await supabase
        .from('technical_skills')
        .update({
          category: editSkill.category,
          skills: skillsArray
        })
        .eq('id', editSkill.id);
        
      if (error) throw error;
      
      toast.success('Technical skill updated successfully');
      setEditSkill(null);
      fetchTechnicalSkills();
    } catch (error) {
      console.error('Error updating technical skill:', error);
      toast.error('Failed to update technical skill');
    }
  };
  
  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill category?')) return;
    
    try {
      const { error } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Technical skill deleted successfully');
      fetchTechnicalSkills();
    } catch (error) {
      console.error('Error deleting technical skill:', error);
      toast.error('Failed to delete technical skill');
    }
  };
  
  useEffect(() => {
    fetchTechnicalSkills();
  }, []);
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Technical Skills Management</CardTitle>
        <CardDescription>Manage technical skills displayed on your About page</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add New Skill Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Skill Category</h3>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Software, Camera Equipment"
              />
            </div>
            
            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Textarea
                id="skills"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                placeholder="e.g., Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve"
                rows={3}
              />
            </div>
            
            <Button onClick={handleAddSkill}>Add Skill Category</Button>
          </div>
        </div>
        
        {/* Edit Skill Form */}
        {editSkill && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Edit Skill Category</h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="edit-category">Category Name</Label>
                <Input
                  id="edit-category"
                  value={editSkill.category}
                  onChange={(e) => setEditSkill({...editSkill, category: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-skills">Skills (comma separated)</Label>
                <Textarea
                  id="edit-skills"
                  value={typeof editSkill.skills === 'string' 
                    ? editSkill.skills 
                    : editSkill.skills.join(', ')}
                  onChange={(e) => setEditSkill({...editSkill, skills: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleUpdateSkill}>Update</Button>
                <Button variant="outline" onClick={() => setEditSkill(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Skills Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicalSkills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No technical skills added yet
                  </TableCell>
                </TableRow>
              ) : (
                technicalSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>{skill.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {skill.skills.map((s: string, i: number) => (
                          <span 
                            key={i} 
                            className="bg-muted px-2 py-1 rounded-sm text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setEditSkill(skill)}
                        >
                          <span className="sr-only">Edit</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11.13 1.21c.48-.48 1.27-.48 1.76 0l1.9 1.9c.48.48.48 1.27 0 1.76l-9.9 9.9-3.98.5.5-3.98 9.72-9.72z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <span className="sr-only">Delete</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 3h-3l-1-1H6L5 3H2v1h12zM4 5v7.5c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5V5z" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between">
        <p className="text-sm text-muted-foreground">
          Total categories: {technicalSkills.length}
        </p>
        <Button variant="outline" onClick={() => window.open('/#about', '_blank')}>
          View Live
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicalSkillsManagement;
