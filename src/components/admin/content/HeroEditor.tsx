
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

const HeroEditor = () => {
  const { toast } = useToast();
  const { data: heroContent, isLoading, error } = useContent('hero');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [primaryBtnText, setPrimaryBtnText] = useState('');
  const [primaryBtnUrl, setPrimaryBtnUrl] = useState('');
  const [secondaryBtnText, setSecondaryBtnText] = useState('');
  const [secondaryBtnUrl, setSecondaryBtnUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (heroContent && heroContent.length > 0) {
      // Find main content (ordering=0)
      const mainContent = heroContent.find(item => item.ordering === 0) || heroContent[0];
      if (mainContent) {
        setHeading(mainContent.title || '');
        setSubheading(mainContent.subtitle || '');
      }
      
      // Find primary button content (ordering=1)
      const primaryBtn = heroContent.find(item => item.ordering === 1);
      if (primaryBtn) {
        setPrimaryBtnText(primaryBtn.button_text || '');
        setPrimaryBtnUrl(primaryBtn.button_url || '');
      }
      
      // Find secondary button content (ordering=2)
      const secondaryBtn = heroContent.find(item => item.ordering === 2);
      if (secondaryBtn) {
        setSecondaryBtnText(secondaryBtn.button_text || '');
        setSecondaryBtnUrl(secondaryBtn.button_url || '');
      }
    } else {
      // Set defaults for new content
      setHeading('Elevate Your Vision with');
      setSubheading('Premium Photography & Videography Solutions for Creators Who Demand Excellence');
      setPrimaryBtnText('Explore Our Work');
      setPrimaryBtnUrl('/portfolio');
      setSecondaryBtnText('Shop LUTs');
      setSecondaryBtnUrl('/shop');
    }
  }, [heroContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Handle main hero content
      const mainContent = heroContent?.find(item => item.ordering === 0);
      if (mainContent) {
        await updateMutation.mutateAsync({
          id: mainContent.id,
          updates: {
            title: heading,
            subtitle: subheading,
            is_published: true
          }
        });
      } else {
        // Create new hero content if none exists
        await createMutation.mutateAsync({
          section: 'hero',
          title: heading,
          subtitle: subheading,
          is_published: true,
          ordering: 0
        });
      }
      
      // Handle primary button
      const primaryBtn = heroContent?.find(item => item.ordering === 1);
      if (primaryBtn) {
        await updateMutation.mutateAsync({
          id: primaryBtn.id,
          updates: {
            button_text: primaryBtnText,
            button_url: primaryBtnUrl,
            is_published: true
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'hero',
          button_text: primaryBtnText,
          button_url: primaryBtnUrl,
          is_published: true,
          ordering: 1
        });
      }
      
      // Handle secondary button
      const secondaryBtn = heroContent?.find(item => item.ordering === 2);
      if (secondaryBtn) {
        await updateMutation.mutateAsync({
          id: secondaryBtn.id,
          updates: {
            button_text: secondaryBtnText,
            button_url: secondaryBtnUrl,
            is_published: true
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'hero',
          button_text: secondaryBtnText,
          button_url: secondaryBtnUrl,
          is_published: true,
          ordering: 2
        });
      }
      
      toast({
        title: "Hero content saved",
        description: "Your hero section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving hero content:', error);
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
          Error loading hero content. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Content</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heading">Main Heading</Label>
            <Input 
              id="heading" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter main heading" 
            />
            <p className="text-xs text-muted-foreground">This appears as the main headline on your homepage</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subheading">Subheading</Label>
            <Textarea 
              id="subheading" 
              value={subheading} 
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Enter subheading text" 
              rows={3}
            />
            <p className="text-xs text-muted-foreground">The secondary text that appears below the main heading</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Buttons</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Primary Button</h3>
            
            <div className="space-y-2">
              <Label htmlFor="primaryBtnText">Button Text</Label>
              <Input 
                id="primaryBtnText" 
                value={primaryBtnText} 
                onChange={(e) => setPrimaryBtnText(e.target.value)}
                placeholder="e.g., Explore Our Work" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primaryBtnUrl">Button URL</Label>
              <Input 
                id="primaryBtnUrl" 
                value={primaryBtnUrl} 
                onChange={(e) => setPrimaryBtnUrl(e.target.value)}
                placeholder="e.g., /portfolio" 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Secondary Button</h3>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryBtnText">Button Text</Label>
              <Input 
                id="secondaryBtnText" 
                value={secondaryBtnText} 
                onChange={(e) => setSecondaryBtnText(e.target.value)}
                placeholder="e.g., Contact Us" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryBtnUrl">Button URL</Label>
              <Input 
                id="secondaryBtnUrl" 
                value={secondaryBtnUrl} 
                onChange={(e) => setSecondaryBtnUrl(e.target.value)}
                placeholder="e.g., /contact" 
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

export default HeroEditor;
