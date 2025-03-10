
import React, { useState, useEffect } from 'react';
import { useContent, useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
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
  const { data: contentData, isLoading } = useContent('about');
  const createContentMutation = useCreateContent();
  const updateContentMutation = useUpdateContent();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const aboutTitle = contentData?.find(item => item.title) || null;
  const aboutContent = contentData?.find(item => item.content) || null;
  const expertiseContent = contentData?.find(item => item.section === 'about' && item.media_url === 'expertise') || null;
  const statsContent = contentData?.find(item => item.section === 'about' && item.media_url === 'stats') || null;
  
  const [title, setTitle] = useState(aboutTitle?.title || 'About Elvis Creative');
  const [subtitle, setSubtitle] = useState(aboutTitle?.subtitle || 'Professional videographer with over 8 years of experience');
  const [mainContent, setMainContent] = useState(aboutContent?.content || '');
  const [expertiseData, setExpertiseData] = useState(expertiseContent?.content || '');
  const [statsData, setStatsData] = useState(statsContent?.content || JSON.stringify([
    { 
      id: 1, 
      iconName: 'Camera', 
      value: 350, 
      suffix: '+', 
      label: 'Photo Projects' 
    },
    { 
      id: 2, 
      iconName: 'Video', 
      value: 120, 
      suffix: '+',  
      label: 'Video Productions' 
    },
    { 
      id: 3, 
      iconName: 'Award', 
      value: 28, 
      suffix: '',  
      label: 'Industry Awards' 
    },
    { 
      id: 4, 
      iconName: 'Users', 
      value: 45, 
      suffix: '+',  
      label: 'Happy Clients' 
    }
  ], null, 2));
  
  // Load data when it's available
  useEffect(() => {
    if (aboutTitle) setTitle(aboutTitle.title || 'About Elvis Creative');
    if (aboutTitle) setSubtitle(aboutTitle.subtitle || 'Professional videographer with over 8 years of experience');
    if (aboutContent) setMainContent(aboutContent.content || '');
    if (expertiseContent) setExpertiseData(expertiseContent.content || '');
    if (statsContent) setStatsData(statsContent.content || '[]');
  }, [aboutTitle, aboutContent, expertiseContent, statsContent]);
  
  const handleSaveOverview = async () => {
    setIsSubmitting(true);
    try {
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
      toast.success('Story content saved successfully');
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Failed to save story content');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveExpertise = async () => {
    setIsSubmitting(true);
    try {
      if (expertiseContent) {
        await updateContentMutation.mutateAsync({
          id: expertiseContent.id,
          updates: {
            content: expertiseData,
            section: 'about',
            media_url: 'expertise'
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: expertiseData,
          section: 'about',
          media_url: 'expertise',
          is_published: true
        });
      }
      toast.success('Expertise content saved successfully');
    } catch (error) {
      console.error('Error saving expertise:', error);
      toast.error('Failed to save expertise content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStats = async () => {
    setIsSubmitting(true);
    try {
      if (statsContent) {
        await updateContentMutation.mutateAsync({
          id: statsContent.id,
          updates: {
            content: statsData,
            section: 'about',
            media_url: 'stats'
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: statsData,
          section: 'about',
          media_url: 'stats',
          is_published: true
        });
      }
      toast.success('Stats content saved successfully');
    } catch (error) {
      console.error('Error saving stats:', error);
      toast.error('Failed to save stats content');
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
          <TabsTrigger value="stats">Stats</TabsTrigger>
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
          
          <TabsContent value="expertise" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise & Projects JSON Data</Label>
              <Textarea
                id="expertise"
                value={expertiseData}
                onChange={(e) => setExpertiseData(e.target.value)}
                placeholder='Enter expertise data in JSON format, e.g. {"expertise": [...], "projects": [...]}'
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter your expertise and projects data in JSON format. Format should be:
                {`{
  "expertise": [
    {"id": 1, "iconName": "Camera", "label": "Videography", "description": "Professional video production"}
  ],
  "projects": [
    {"id": 1, "iconName": "Video", "title": "Commercial Videos", "description": "Professional videos for businesses"}
  ]
}`}
              </p>
            </div>
            
            <Button 
              onClick={handleSaveExpertise} 
              disabled={isSubmitting}
              className="mt-4"
            >
              {isSubmitting ? 'Saving...' : 'Save Expertise Data'}
            </Button>
          </TabsContent>

          <TabsContent value="stats" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stats">Stats JSON Data</Label>
              <Textarea
                id="stats"
                value={statsData}
                onChange={(e) => setStatsData(e.target.value)}
                placeholder='Enter stats data in JSON format'
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter your stats in JSON format. Each item should include:
                {`[
  { 
    "id": 1, 
    "iconName": "Camera", 
    "value": 350, 
    "suffix": "+", 
    "label": "Photo Projects" 
  }
]`}
              </p>
            </div>
            
            <Button 
              onClick={handleSaveStats} 
              disabled={isSubmitting}
              className="mt-4"
            >
              {isSubmitting ? 'Saving...' : 'Save Stats Data'}
            </Button>
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
