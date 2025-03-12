
import React, { useState, useEffect } from 'react';
import { useContent, useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AdminLoadingState from '../AdminLoadingState';

const AboutContentEditor = () => {
  const { data: contentData, isLoading } = useContent('about');
  const createContentMutation = useCreateContent();
  const updateContentMutation = useUpdateContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const aboutTitle = contentData?.find(item => item.title) || null;
  const aboutContent = contentData?.find(item => item.content) || null;
  
  const [title, setTitle] = useState(aboutTitle?.title || 'About Elvis Creative');
  const [subtitle, setSubtitle] = useState(aboutTitle?.subtitle || 'Professional videographer with over 8 years of experience');
  const [mainContent, setMainContent] = useState(aboutContent?.content || '');
  
  // Load data when it's available
  useEffect(() => {
    if (aboutTitle) setTitle(aboutTitle.title || 'About Elvis Creative');
    if (aboutTitle) setSubtitle(aboutTitle.subtitle || 'Professional videographer with over 8 years of experience');
    if (aboutContent) setMainContent(aboutContent.content || '');
  }, [aboutTitle, aboutContent]);
  
  const handleSaveContent = async () => {
    setIsSubmitting(true);
    try {
      // Save title and subtitle
      if (aboutTitle) {
        await updateContentMutation.mutateAsync({ 
          id: aboutTitle.id, 
          updates: {
            title,
            subtitle,
            section: 'about'
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          title,
          subtitle,
          section: 'about',
          is_published: true
        });
      }
      
      // Save main content
      if (aboutContent) {
        await updateContentMutation.mutateAsync({
          id: aboutContent.id,
          updates: {
            content: mainContent,
            section: 'about'
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: mainContent,
          section: 'about',
          is_published: true
        });
      }
      
      toast.success('About content saved successfully');
    } catch (error) {
      console.error('Error saving about content:', error);
      toast.error('Failed to save about content');
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
          <CardTitle>About Section Header</CardTitle>
          <CardDescription>The main title and subtitle shown at the top of the About section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="About Elvis Creative"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Professional videographer with over 8 years of experience"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>My Story</CardTitle>
          <CardDescription>The main content displayed in the About section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story">My Story Content</Label>
            <Textarea
              id="story"
              value={mainContent}
              onChange={(e) => setMainContent(e.target.value)}
              placeholder="Enter your story here"
              className="min-h-[300px]"
            />
            <p className="text-xs text-muted-foreground">
              This content will be displayed in the main "My Story" section
            </p>
          </div>
          
          <Button 
            onClick={handleSaveContent} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save About Content'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContentEditor;
