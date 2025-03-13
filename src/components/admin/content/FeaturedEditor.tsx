
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMedia } from '@/hooks/useMedia';
import { Tables } from '@/types/supabase';
import MediaSelector from '../shared/MediaSelector';

const FeaturedEditor = () => {
  const { toast } = useToast();
  const { data: featuredContent, isLoading: isContentLoading, error: contentError } = useContent('featured');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSelectingMedia, setIsSelectingMedia] = useState(false);

  useEffect(() => {
    if (featuredContent && featuredContent.length > 0) {
      const content = featuredContent.find(c => c.ordering === 0) || featuredContent[0];
      setHeading(content.title || '');
      setSubheading(content.subtitle || '');
      setButtonText(content.button_text || '');
      setButtonUrl(content.button_url || '');
    }
  }, [featuredContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (featuredContent && featuredContent.length > 0) {
        const content = featuredContent.find(c => c.ordering === 0) || featuredContent[0];
        await updateMutation.mutateAsync({
          id: content.id,
          updates: {
            title: heading,
            subtitle: subheading,
            button_text: buttonText,
            button_url: buttonUrl
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'featured',
          title: heading,
          subtitle: subheading,
          button_text: buttonText,
          button_url: buttonUrl,
          is_published: true,
          ordering: 0
        });
      }
      
      toast({
        title: "Featured content saved",
        description: "Your featured projects section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving featured content:', error);
      toast({
        title: "Error saving content",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isContentLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (contentError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading featured content. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Projects Section</CardTitle>
          <CardDescription>
            Edit the heading and content for the featured projects section
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featuredHeading">Section Heading</Label>
            <Input 
              id="featuredHeading" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter section heading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="featuredSubheading">Section Subheading</Label>
            <Textarea 
              id="featuredSubheading" 
              value={subheading} 
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Enter section subheading" 
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="featuredButtonText">Button Text</Label>
              <Input 
                id="featuredButtonText" 
                value={buttonText} 
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g., View All Projects" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredButtonUrl">Button URL</Label>
              <Input 
                id="featuredButtonUrl" 
                value={buttonUrl} 
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="e.g., /portfolio" 
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
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Featured Media Selection</h3>
        <p className="text-sm text-muted-foreground">
          Note: Featured projects are controlled by starring media in the Media Management section. 
          To make media appear here, go to Media Management and mark items as featured.
        </p>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin?tab=media'}
          >
            Go to Media Management
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEditor;
