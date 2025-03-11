
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, MoveUp, MoveDown, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  order_index: number;
}

const FeaturedProjectsEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['featured_projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_projects')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as FeaturedProject[];
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FeaturedProject> }) => {
      let image_url = data.image_url;
      
      // Upload image if a new one is selected
      if (imageFiles[id]) {
        setIsUploading(prev => ({ ...prev, [id]: true }));
        const fileName = `project_${Date.now()}_${imageFiles[id]!.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`projects/${fileName}`, imageFiles[id]!);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`projects/${fileName}`);
          
        image_url = urlData.publicUrl;
        setIsUploading(prev => ({ ...prev, [id]: false }));
        setImageFiles(prev => ({ ...prev, [id]: null }));
      }
      
      const { data: responseData, error } = await supabase
        .from('featured_projects')
        .update({ 
          ...data,
          ...(image_url ? { image_url } : {})
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return responseData[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured_projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async () => {
      // Calculate next order index
      const nextIndex = projects?.length ? Math.max(...projects.map(p => p.order_index || 0)) + 1 : 0;
      
      const newProject = {
        title: 'New Project',
        description: 'Project description',
        image_url: '',
        project_url: '',
        order_index: nextIndex
      };
      
      const { data, error } = await supabase
        .from('featured_projects')
        .insert([newProject])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['featured_projects'] });
      setEditMode(prev => ({ ...prev, [data.id]: true }));
      toast({
        title: "Success",
        description: "New project created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create new project",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured_projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  });
  
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      if (!projects) return null;
      
      const currentIndex = projects.findIndex(p => p.id === id);
      if (currentIndex === -1) return null;
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= projects.length) return null;
      
      const currentProject = projects[currentIndex];
      const targetProject = projects[targetIndex];
      
      // Swap order_index values
      const updates = [
        { id: currentProject.id, order_index: targetProject.order_index },
        { id: targetProject.id, order_index: currentProject.order_index }
      ];
      
      // Update both items
      for (const update of updates) {
        const { error } = await supabase
          .from('featured_projects')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured_projects'] });
    },
    onError: (error) => {
      console.error("Error reordering projects:", error);
      toast({
        title: "Error",
        description: "Failed to reorder projects",
        variant: "destructive"
      });
    }
  });
  
  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFiles(prev => ({ ...prev, [id]: file }));
    }
  };
  
  const handleToggleEdit = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleSaveProject = (project: FeaturedProject) => {
    updateMutation.mutate({
      id: project.id,
      data: {
        title: project.title,
        description: project.description,
        project_url: project.project_url
      }
    });
  };
  
  const handleInputChange = (id: string, field: keyof FeaturedProject, value: string) => {
    const project = projects?.find(p => p.id === id);
    if (!project) return;
    
    const updatedProject = { ...project, [field]: value };
    
    // We don't save on every keystroke, only when the user clicks Save
    // Just update the local state for now
    const projectIndex = projects.findIndex(p => p.id === id);
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = updatedProject;
    queryClient.setQueryData(['featured_projects'], updatedProjects);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Featured Projects</h3>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="bg-elvis-pink hover:bg-elvis-pink/90"
        >
          {createMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add Project
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {[1, 2].map(i => (
            <Card key={i} className="bg-elvis-medium animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {projects?.map(project => (
            <Card key={project.id} className="bg-elvis-medium">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: project.id, direction: 'up' })}
                      disabled={!projects || projects.indexOf(project) === 0 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reorderMutation.mutate({ id: project.id, direction: 'down' })}
                      disabled={!projects || projects.indexOf(project) === projects.length - 1 || reorderMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleEdit(project.id)}
                      className="h-8 w-8 p-0"
                    >
                      {editMode[project.id] ? "Done" : "Edit"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteMutation.mutate(project.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {editMode[project.id] ? (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                      <Input
                        id={`title-${project.id}`}
                        value={project.title}
                        onChange={(e) => handleInputChange(project.id, 'title', e.target.value)}
                        className="bg-elvis-dark"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${project.id}`}>Description</Label>
                      <Textarea
                        id={`description-${project.id}`}
                        value={project.description}
                        onChange={(e) => handleInputChange(project.id, 'description', e.target.value)}
                        className="bg-elvis-dark min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`url-${project.id}`}>Project URL</Label>
                      <Input
                        id={`url-${project.id}`}
                        value={project.project_url}
                        onChange={(e) => handleInputChange(project.id, 'project_url', e.target.value)}
                        className="bg-elvis-dark"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`image-${project.id}`}>Project Image</Label>
                      <div className="flex items-start gap-4 mt-2">
                        <div className="flex-1">
                          <Input
                            id={`image-${project.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(project.id, e)}
                            className="bg-elvis-dark"
                          />
                        </div>
                        {(project.image_url || imageFiles[project.id]) && (
                          <div className="w-24 h-24 rounded-md overflow-hidden">
                            <img 
                              src={imageFiles[project.id] ? URL.createObjectURL(imageFiles[project.id]!) : project.image_url} 
                              alt={project.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button 
                        onClick={() => handleSaveProject(project)}
                        disabled={updateMutation.isPending || isUploading[project.id]}
                        className="w-full bg-elvis-pink hover:bg-elvis-pink/90"
                      >
                        {(updateMutation.isPending || isUploading[project.id]) && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="space-y-4">
                    {project.image_url ? (
                      <div className="aspect-video overflow-hidden rounded-md relative">
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-elvis-dark rounded-md flex items-center justify-center">
                        <Upload className="h-12 w-12 text-elvis-light/40" />
                      </div>
                    )}
                    <p className="text-white/70 line-clamp-2 text-sm">{project.description}</p>
                    {project.project_url && (
                      <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-elvis-pink hover:underline text-sm block"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProjectsEditor;
