
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

const EquipmentEditor = () => {
  const { toast } = useToast();
  const { data: equipmentContent, isLoading, error } = useContent('equipment');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (equipmentContent && equipmentContent.length > 0) {
      const content = equipmentContent[0];
      setHeading(content.title || '');
      setSubheading(content.subtitle || '');
      setDescription(content.content || '');
      setButtonText(content.button_text || '');
      setButtonUrl(content.button_url || '');
    }
  }, [equipmentContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (equipmentContent && equipmentContent.length > 0) {
        const content = equipmentContent[0];
        await updateMutation.mutateAsync({
          id: content.id,
          updates: {
            title: heading,
            subtitle: subheading,
            content: description,
            button_text: buttonText,
            button_url: buttonUrl
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'equipment',
          title: heading,
          subtitle: subheading,
          content: description,
          button_text: buttonText,
          button_url: buttonUrl,
          is_published: true,
          ordering: 0
        });
      }
      
      toast({
        title: "Equipment section saved",
        description: "Your equipment section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving equipment content:', error);
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
          Error loading equipment content. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Equipment Section Content</CardTitle>
          <CardDescription>
            Edit the content for the equipment showcase section
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equipmentHeading">Section Heading</Label>
            <Input 
              id="equipmentHeading" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter section heading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipmentSubheading">Section Subheading</Label>
            <Input 
              id="equipmentSubheading" 
              value={subheading} 
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Enter section subheading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="equipmentDescription">Description</Label>
            <Textarea 
              id="equipmentDescription" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter section description" 
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentButtonText">Button Text</Label>
              <Input 
                id="equipmentButtonText" 
                value={buttonText} 
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g., View Equipment List" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentButtonUrl">Button URL</Label>
              <Input 
                id="equipmentButtonUrl" 
                value={buttonUrl} 
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="e.g., /equipment" 
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Note:</p>
            <p className="text-sm text-muted-foreground">
              Individual equipment items are managed in the Equipment Management tab. 
              This section only controls the section header content.
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
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/admin?tab=equipment'}
        >
          Manage Equipment Items
        </Button>
      </div>
    </div>
  );
};

export default EquipmentEditor;
