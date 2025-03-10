
import React, { useState } from 'react';
import { useContent } from '@/hooks/api/useContent';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLoadingState from './AdminLoadingState';

const AboutContentEditor = () => {
  const { data: contentData, isLoading, createContent, updateContent } = useContent('about');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const aboutTitle = contentData?.find(item => item.title) || null;
  const aboutContent = contentData?.find(item => item.content) || null;
  
  const [title, setTitle] = useState(aboutTitle?.title || 'About Elvis Creative');
  const [subtitle, setSubtitle] = useState(aboutTitle?.subtitle || 'Professional videographer with over 8 years of experience');
  const [mainContent, setMainContent] = useState(aboutContent?.content || '');
  
  const handleSaveOverview = async () => {
    setIsSubmitting(true);
    try {
      if (aboutTitle) {
        await updateContent(aboutTitle.id, {
          title,
          subtitle,
          section: 'about'
        });
      } else {
        await createContent({
          title,
          subtitle,
          section: 'about',
          is_published: true
        });
      }
      toast.success('Overview saved successfully');
    } catch (error) {
      console.error('Error saving overview:', error);
      toast.error('Failed to save overview');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveStory = async () => {
    setIsSubmitting(true);
    try {
      if (aboutContent) {
        await updateContent(aboutContent.id, {
          content: mainContent,
          section: 'about'
        });
      } else {
        await createContent({
          content: mainContent,
          section: 'about',
          is_published: true
        });
      }
      toast.success('Story content saved successfully');
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Failed to save story content');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>About Section Content</CardTitle>
        <CardDescription>Manage the content displayed in the About section of your website</CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b pb-0 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="story">My Story</TabsTrigger>
          <TabsTrigger value="expertise">Expertise & Projects</TabsTrigger>
        </TabsList>
        
        <CardContent>
          <TabsContent value="overview" className="pt-4 space-y-4">
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
            
            <Button 
              onClick={handleSaveOverview} 
              disabled={isSubmitting}
              className="mt-4"
            >
              {isSubmitting ? 'Saving...' : 'Save Overview'}
            </Button>
          </TabsContent>
          
          <TabsContent value="story" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="story">My Story Content</Label>
              <Textarea
                id="story"
                value={mainContent}
                onChange={(e) => setMainContent(e.target.value)}
                placeholder="Enter your story here (HTML formatting supported)"
                className="min-h-[300px]"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML tags for formatting: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
              </p>
            </div>
            
            <Button 
              onClick={handleSaveStory} 
              disabled={isSubmitting}
              className="mt-4"
            >
              {isSubmitting ? 'Saving...' : 'Save Story'}
            </Button>
          </TabsContent>
          
          <TabsContent value="expertise" className="pt-4">
            <div className="p-4 rounded-md bg-muted/50 text-center">
              <p>The expertise, projects, and technical skills editor will be available in the next update.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Currently, these items are defined in the code. Soon, you'll be able to edit them directly here.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="justify-between border-t pt-4 mt-4">
        <p className="text-sm text-muted-foreground">
          Last updated: {aboutContent?.updated_at ? new Date(aboutContent.updated_at).toLocaleString() : 'Not yet saved'}
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.open('/#about', '_blank')}>
            View Live
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AboutContentEditor;
