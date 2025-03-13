
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2, Save } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const ScrollIndicatorEditor = () => {
  const { toast } = useToast();
  const { data: scrollContent, isLoading, error } = useContent('scroll-indicator');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [scrollLabel, setScrollLabel] = useState('');
  const [targetElement, setTargetElement] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scrollContent && scrollContent.length > 0) {
      const content = scrollContent[0];
      setScrollLabel(content.title || 'Discover');
      setTargetElement(content.content || 'about-section');
    }
  }, [scrollContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (scrollContent && scrollContent.length > 0) {
        const scrollItem = scrollContent[0];
        await updateMutation.mutateAsync({
          id: scrollItem.id,
          updates: {
            title: scrollLabel,
            content: targetElement
          }
        });
      } else {
        // Create new scroll indicator content if none exists
        await createMutation.mutateAsync({
          section: 'scroll-indicator',
          title: scrollLabel,
          content: targetElement,
          is_published: true,
          ordering: 0
        });
      }
      
      toast({
        title: "Scroll indicator updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Error saving scroll indicator content:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading scroll indicator settings. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scroll Indicator Settings</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scrollLabel">Scroll Label Text</Label>
            <Input 
              id="scrollLabel" 
              value={scrollLabel} 
              onChange={(e) => setScrollLabel(e.target.value)}
              placeholder="e.g., Discover, Explore, Scroll Down" 
            />
            <p className="text-sm text-muted-foreground">
              This text appears above the scroll indicator in the hero section.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetElement">Target Element ID</Label>
            <Input 
              id="targetElement" 
              value={targetElement} 
              onChange={(e) => setTargetElement(e.target.value)}
              placeholder="e.g., about-section" 
            />
            <p className="text-sm text-muted-foreground">
              The ID of the element to scroll to when the indicator is clicked. 
              Leave as "about-section" if unsure.
            </p>
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

export default ScrollIndicatorEditor;
