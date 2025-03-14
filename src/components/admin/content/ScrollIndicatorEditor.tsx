
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ScrollIndicatorEditor = () => {
  const { toast } = useToast();
  const { data: scrollContent, isLoading, error } = useContent('scroll-indicator');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [scrollLabel, setScrollLabel] = useState('Discover');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scrollContent && scrollContent.length > 0) {
      setScrollLabel(scrollContent[0].title || 'Discover');
    }
  }, [scrollContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (scrollContent && scrollContent.length > 0) {
        await updateMutation.mutateAsync({
          id: scrollContent[0].id,
          updates: {
            title: scrollLabel,
            is_published: true
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'scroll-indicator',
          title: scrollLabel,
          is_published: true,
          ordering: 0
        });
      }
      
      toast({
        title: "Scroll indicator updated",
        description: "Your scroll indicator settings have been saved."
      });
    } catch (error) {
      console.error('Error saving scroll indicator:', error);
      toast({
        title: "Error saving settings",
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
        
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="scrollLabel">Scroll Label Text</Label>
            <Input 
              id="scrollLabel" 
              value={scrollLabel} 
              onChange={(e) => setScrollLabel(e.target.value)}
              placeholder="e.g., Discover, Scroll Down, Explore" 
            />
            <p className="text-xs text-muted-foreground">
              This is the text that appears above the scroll indicator at the bottom of the hero section
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
                <span>Save Changes</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScrollIndicatorEditor;
