
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowDown, Loader2, Save, MousePointer, Check } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { CardTitleWithIcon } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const ScrollIndicatorEditor = () => {
  const { toast } = useToast();
  const { data: scrollContent, isLoading, error } = useContent('scroll-indicator');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [scrollLabel, setScrollLabel] = useState('');
  const [targetElement, setTargetElement] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (scrollContent && scrollContent.length > 0) {
      const content = scrollContent[0];
      setScrollLabel(content.title || 'Discover');
      setTargetElement(content.content || 'about-section');
      setIsEnabled(content.is_published !== false);
    }
  }, [scrollContent]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      if (scrollContent && scrollContent.length > 0) {
        const scrollItem = scrollContent[0];
        await updateMutation.mutateAsync({
          id: scrollItem.id,
          updates: {
            title: scrollLabel,
            content: targetElement,
            is_published: isEnabled
          }
        });
      } else {
        // Create new scroll indicator content if none exists
        await createMutation.mutateAsync({
          section: 'scroll-indicator',
          title: scrollLabel,
          content: targetElement,
          is_published: isEnabled,
          ordering: 0
        });
      }
      
      setSaveSuccess(true);
      toast({
        title: "Scroll indicator updated",
        description: "Your changes have been saved successfully."
      });
      
      // Reset the success indicator after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitleWithIcon 
            icon={<ArrowDown className="h-5 w-5 text-elvis-pink" />}
            className="text-xl"
          >
            Scroll Indicator Settings
          </CardTitleWithIcon>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableScrollIndicator">Enable Scroll Indicator</Label>
              <p className="text-sm text-muted-foreground">
                Show or hide the scroll indicator in the hero section
              </p>
            </div>
            <Switch 
              id="enableScrollIndicator" 
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <div 
              className={cn(
                "space-y-6 transition-opacity duration-300",
                !isEnabled && "opacity-50 pointer-events-none"
              )}
            >
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
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  The ID of the element to scroll to when the indicator is clicked. 
                  Leave as "about-section" if unsure.
                </p>
              </div>
              
              <div className="bg-elvis-dark/30 rounded-md p-4">
                <div className="flex items-start">
                  <MousePointer className="h-4 w-4 mt-1 mr-2 text-elvis-pink" />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Preview</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is how your scroll indicator will appear on your homepage.
                    </p>
                    <div className="flex flex-col items-center justify-center bg-elvis-dark/30 p-6 rounded-md mt-2">
                      <p className="text-sm mb-2">{scrollLabel || 'Discover'}</p>
                      <div className="animate-bounce">
                        <ArrowDown className="h-5 w-5 text-elvis-pink" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t border-white/10 pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 min-w-24",
              saveSuccess && "bg-green-600 hover:bg-green-700"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved!</span>
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
