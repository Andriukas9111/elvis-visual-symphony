
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import ImageUpload from '../ui/ImageUpload';
import SavedIndicator from '../ui/SavedIndicator';
import FormError from '../ui/FormError';

interface FeaturedProject {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  video_url?: string;
  order_index: number;
  is_featured: boolean;
}

const FeaturedProjectsForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['featuredProjects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('featured_projects')
          .select('*')
          .order('order_index');
          
        if (error) throw error;
        return data as FeaturedProject[];
      } catch (error: any) {
        setError(`Failed to load featured projects: ${error.message}`);
        throw error;
      }
    }
  });
  
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const nextIndex = projects?.length ? Math.max(...projects.map(s => s.order_index || 0)) + 1 : 0;
        
        const newProject = {
          title: 'New Project',
          image_url: '',
          order_index: nextIndex,
          is_featured: false
        };
        
        const { data, error } = await supabase
          .from('featured_projects')
          .insert([newProject])
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to create new project: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
    }
  });
  
  const updateProjectMutation = useMutation({
    mutationFn: async (project: FeaturedProject) => {
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('featured_projects')
          .update({
            title: project.title,
            description: project.description,
            image_url: project.image_url,
            video_url: project.video_url,
            is_featured: project.is_featured
          })
          .eq('id', project.id)
          .select();
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return data[0];
      } catch (error: any) {
        setError(`Failed to update project: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
    }
  });
  
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      
      try {
        const { error } = await supabase
          .from('featured_projects')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setLastSaved(new Date());
        return id;
      } catch (error: any) {
        setError(`Failed to delete project: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
    }
  });
  
  const moveProjectMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        if (!projects) return null;
        
        const currentIndex = projects.findIndex(s => s.id === id);
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
        
        setLastSaved(new Date());
        return { success: true };
      } catch (error: any) {
        setError(`Failed to reorder projects: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProjects'] });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-elvis-pink" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Featured Projects</CardTitle>
          <SavedIndicator lastSaved={lastSaved} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormError error={error} />
        
        <div className="flex justify-end">
          <Button
            onClick={() => createProjectMutation.mutate()}
            disabled={isSubmitting}
            className="bg-elvis-pink hover:bg-elvis-pink/90"
          >
            {createProjectMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Project
          </Button>
        </div>
        
        <div className="space-y-4">
          {projects?.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSave={(updatedProject) => updateProjectMutation.mutate(updatedProject)}
              onDelete={() => {
                if (window.confirm('Are you sure you want to delete this project?')) {
                  deleteProjectMutation.mutate(project.id);
                }
              }}
              onMove={(direction) => moveProjectMutation.mutate({ id: project.id, direction })}
              isFirst={index === 0}
              isLast={index === projects.length - 1}
              isSubmitting={isSubmitting}
            />
          ))}
          
          {projects?.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No projects found. Click the "Add Project" button to create your first project.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ProjectCardProps {
  project: FeaturedProject;
  onSave: (project: FeaturedProject) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSave,
  onDelete,
  onMove,
  isFirst,
  isLast,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProject, setLocalProject] = useState<FeaturedProject>(project);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: keyof FeaturedProject, value: any) => {
    setLocalProject(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(localProject);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleImageUploaded = (url: string) => {
    handleChange('image_url', url);
  };
  
  return (
    <Card className="bg-elvis-medium">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg flex items-center">
            <span className={localProject.is_featured ? "text-elvis-pink" : "text-muted-foreground"}>
              {localProject.is_featured ? "★ " : ""}
            </span>
            {localProject.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove('up')}
              disabled={isFirst || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMove('down')}
              disabled={isLast || isSubmitting}
              className="h-8 w-8 p-0"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              disabled={isSubmitting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-200/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`title-${project.id}`}>Title</Label>
              <Input
                id={`title-${project.id}`}
                value={localProject.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            
            <div>
              <Label htmlFor={`description-${project.id}`}>Description (optional)</Label>
              <Textarea
                id={`description-${project.id}`}
                value={localProject.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="bg-elvis-dark"
              />
            </div>
            
            <div>
              <Label htmlFor={`video-${project.id}`}>Video URL (optional)</Label>
              <Input
                id={`video-${project.id}`}
                value={localProject.video_url || ''}
                onChange={(e) => handleChange('video_url', e.target.value)}
                className="bg-elvis-dark"
                placeholder="https://www.youtube.com/watch?v=example"
              />
            </div>
            
            <div>
              <Label htmlFor={`featured-${project.id}`} className="flex items-center gap-2">
                <Switch
                  id={`featured-${project.id}`}
                  checked={localProject.is_featured}
                  onCheckedChange={(checked) => handleChange('is_featured', checked)}
                />
                <span>Featured on homepage</span>
              </Label>
            </div>
            
            <div>
              <Label>Project Image</Label>
              <ImageUpload
                currentImageUrl={localProject.image_url}
                onImageUploaded={handleImageUploaded}
                bucket="projects"
                folder="featured"
              />
            </div>
            
            <div className="pt-3">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isSubmitting}
                className="w-full bg-elvis-pink hover:bg-elvis-pink/90"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/3">
              {localProject.image_url ? (
                <img 
                  src={localProject.image_url} 
                  alt={localProject.title} 
                  className="w-full h-40 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-40 bg-elvis-dark rounded-md flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="sm:w-2/3">
              {localProject.description && (
                <p className="text-sm text-muted-foreground mb-2">{localProject.description}</p>
              )}
              {localProject.video_url && (
                <p className="text-xs">
                  <span className="text-muted-foreground">Video URL: </span>
                  <a href={localProject.video_url} target="_blank" rel="noopener noreferrer" className="text-elvis-pink">
                    {localProject.video_url}
                  </a>
                </p>
              )}
              <div className="mt-2 text-xs">
                <span className="text-muted-foreground">Status: </span>
                <span className={localProject.is_featured ? "text-green-500" : "text-yellow-500"}>
                  {localProject.is_featured ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedProjectsForm;
