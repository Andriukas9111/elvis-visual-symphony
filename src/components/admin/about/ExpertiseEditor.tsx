
import React, { useState, useEffect } from 'react';
import { useContent, useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLoadingState from '../AdminLoadingState';
import { LucideCode, LucideEye } from 'lucide-react';

const ExpertiseEditor = () => {
  const { data: contentData, isLoading } = useContent('about');
  const createContentMutation = useCreateContent();
  const updateContentMutation = useUpdateContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('edit');
  
  const expertiseContent = contentData?.find(item => 
    item.section === 'about' && item.media_url === 'expertise'
  ) || null;
  
  const defaultExpertiseData = JSON.stringify([
    {
      id: "1",
      iconName: "Camera",
      label: "Videography",
      description: "Professional video production services for various types of projects"
    },
    {
      id: "2",
      iconName: "Film",
      label: "Film Production",
      description: "End-to-end film production services including planning, shooting, and post-production"
    }
  ], null, 2);
  
  const defaultProjectsData = JSON.stringify([
    {
      id: "1",
      iconName: "Video",
      title: "Commercial Videos",
      description: "Professional videos for businesses and products"
    },
    {
      id: "2",
      iconName: "Camera",
      title: "Wedding Films",
      description: "Capturing your special day with cinematic quality"
    }
  ], null, 2);

  const [expertiseJson, setExpertiseJson] = useState<string>('');
  const [projectsJson, setProjectsJson] = useState<string>('');
  const [previewData, setPreviewData] = useState<any>(null);
  
  // Load data when it's available
  useEffect(() => {
    if (expertiseContent?.content) {
      try {
        const parsedData = JSON.parse(expertiseContent.content);
        if (parsedData.expertise) {
          setExpertiseJson(JSON.stringify(parsedData.expertise, null, 2));
        } else {
          setExpertiseJson(defaultExpertiseData);
        }
        
        if (parsedData.projects) {
          setProjectsJson(JSON.stringify(parsedData.projects, null, 2));
        } else {
          setProjectsJson(defaultProjectsData);
        }
      } catch (error) {
        console.error('Error parsing expertise content:', error);
        setExpertiseJson(defaultExpertiseData);
        setProjectsJson(defaultProjectsData);
      }
    } else {
      setExpertiseJson(defaultExpertiseData);
      setProjectsJson(defaultProjectsData);
    }
  }, [expertiseContent]);
  
  const updatePreview = () => {
    try {
      const expertise = JSON.parse(expertiseJson);
      const projects = JSON.parse(projectsJson);
      setPreviewData({ expertise, projects });
      return true;
    } catch (error) {
      console.error('Invalid JSON in one of the fields', error);
      toast.error('Invalid JSON. Please check your syntax.');
      return false;
    }
  };
  
  const handleSaveExpertise = async () => {
    if (!updatePreview()) return;
    
    setIsSubmitting(true);
    try {
      const combinedData = JSON.stringify({
        expertise: JSON.parse(expertiseJson),
        projects: JSON.parse(projectsJson)
      });
      
      if (expertiseContent) {
        await updateContentMutation.mutateAsync({
          id: expertiseContent.id,
          updates: {
            content: combinedData,
            section: 'about',
            media_url: 'expertise'
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: combinedData,
          section: 'about',
          media_url: 'expertise',
          is_published: true
        });
      }
      
      toast.success('Expertise and projects saved successfully');
    } catch (error) {
      console.error('Error saving expertise and projects:', error);
      toast.error('Failed to save expertise and projects');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Expertise & Projects</CardTitle>
              <CardDescription>Manage the expertise and projects displayed in the About section</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="edit" className="flex items-center gap-1">
                  <LucideCode size={14} />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1" onClick={updatePreview}>
                  <LucideEye size={14} />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="edit" className="mt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expertise">My Expertise</Label>
              <Textarea
                id="expertise"
                value={expertiseJson}
                onChange={(e) => setExpertiseJson(e.target.value)}
                placeholder="Enter your expertise as JSON array"
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: Array of objects with id, iconName, label, and description properties
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projects">My Projects</Label>
              <Textarea
                id="projects"
                value={projectsJson}
                onChange={(e) => setProjectsJson(e.target.value)}
                placeholder="Enter your projects as JSON array"
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: Array of objects with id, iconName, title, and description properties
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
            {previewData && (
              <div className="border rounded-md p-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Expertise Preview:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {previewData.expertise.map((item: any) => (
                      <div key={item.id} className="border p-4 rounded-md">
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-2 text-xs text-muted-foreground">Icon: {item.iconName}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Projects Preview:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {previewData.projects.map((item: any) => (
                      <div key={item.id} className="border p-4 rounded-md">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-2 text-xs text-muted-foreground">Icon: {item.iconName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveExpertise} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save Expertise & Projects'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpertiseEditor;
