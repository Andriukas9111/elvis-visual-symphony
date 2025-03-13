
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AboutEditor = () => {
  const { toast } = useToast();
  const { data: aboutContent, isLoading, error } = useContent('about');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [mainText, setMainText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (aboutContent && aboutContent.length > 0) {
      const content = aboutContent[0];
      setHeading(content.title || '');
      setSubheading(content.subtitle || '');
      setMainText(content.content || '');
      setButtonText(content.button_text || '');
      setButtonUrl(content.button_url || '');
      setMediaUrl(content.media_url || '');
    }
  }, [aboutContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (aboutContent && aboutContent.length > 0) {
        const content = aboutContent[0];
        await updateMutation.mutateAsync({
          id: content.id,
          updates: {
            title: heading,
            subtitle: subheading,
            content: mainText,
            button_text: buttonText,
            button_url: buttonUrl,
            media_url: mediaUrl
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'about',
          title: heading,
          subtitle: subheading,
          content: mainText,
          button_text: buttonText,
          button_url: buttonUrl,
          media_url: mediaUrl,
          is_published: true,
          ordering: 0
        });
      }
      
      toast({
        title: "About content saved",
        description: "Your about section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving about content:', error);
      toast({
        title: "Error saving content",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading about content. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Section Content</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aboutHeading">Section Heading</Label>
            <Input 
              id="aboutHeading" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter section heading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aboutSubheading">Subheading</Label>
            <Input 
              id="aboutSubheading" 
              value={subheading} 
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Enter subheading text" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aboutMainText">Main Content</Label>
            <Textarea 
              id="aboutMainText" 
              value={mainText} 
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Enter main content text" 
              rows={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aboutMediaUrl">Image/Video URL</Label>
            <Input 
              id="aboutMediaUrl" 
              value={mediaUrl} 
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Enter media URL (image or video)" 
            />
            <p className="text-sm text-muted-foreground">
              This will be displayed as the main visual for the about section
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aboutButtonText">Button Text</Label>
              <Input 
                id="aboutButtonText" 
                value={buttonText} 
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g., Learn More" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aboutButtonUrl">Button URL</Label>
              <Input 
                id="aboutButtonUrl" 
                value={buttonUrl} 
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="e.g., /about" 
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AboutEditor;
