
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2, Plus, Trash } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent, useDeleteContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  ordering: number;
}

const ServicesEditor = () => {
  const { toast } = useToast();
  const { data: servicesContent, isLoading, error } = useContent('services');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  const deleteMutation = useDeleteContent();
  
  const [heading, setHeading] = useState('Professional Services');
  const [subheading, setSubheading] = useState('Comprehensive video and photography services tailored to your unique vision and requirements.');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (servicesContent && servicesContent.length > 0) {
      // Find main heading (usually ordering=0)
      const headingContent = servicesContent.find(item => item.ordering === 0);
      if (headingContent) {
        setHeading(headingContent.title || 'Professional Services');
        setSubheading(headingContent.subtitle || '');
      }
      
      // Process service items (ordering > 0)
      const serviceItems = servicesContent
        .filter(item => item.ordering && item.ordering > 0)
        .map(item => ({
          id: item.id,
          title: item.title || '',
          description: item.content || '',
          icon: item.media_url || 'Video',
          ordering: item.ordering || 1
        }))
        .sort((a, b) => a.ordering - b.ordering);
      
      if (serviceItems.length > 0) {
        setServices(serviceItems);
      } else {
        // Default services if none exist
        setServices([
          { title: 'Cinematic Videography', description: 'Professional film-quality videos for brands, events, and creative projects.', icon: 'Video', ordering: 1 },
          { title: 'Photography', description: 'High-quality photography for commercial, portrait, and artistic purposes.', icon: 'Camera', ordering: 2 },
          { title: 'Video Production', description: 'End-to-end production services from concept development to final delivery.', icon: 'Film', ordering: 3 },
          { title: 'Post-Production', description: 'Professional editing, color grading, and motion graphics for visual content.', icon: 'Edit', ordering: 4 }
        ]);
      }
    } else {
      // Set defaults for new content
      setServices([
        { title: 'Cinematic Videography', description: 'Professional film-quality videos for brands, events, and creative projects.', icon: 'Video', ordering: 1 },
        { title: 'Photography', description: 'High-quality photography for commercial, portrait, and artistic purposes.', icon: 'Camera', ordering: 2 },
        { title: 'Video Production', description: 'End-to-end production services from concept development to final delivery.', icon: 'Film', ordering: 3 },
        { title: 'Post-Production', description: 'Professional editing, color grading, and motion graphics for visual content.', icon: 'Edit', ordering: 4 }
      ]);
    }
  }, [servicesContent]);

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const handleAddService = () => {
    const newService: ServiceItem = {
      title: '',
      description: '',
      icon: 'Coffee',
      ordering: services.length + 1
    };
    setServices([...services, newService]);
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...services];
    const removedService = updatedServices[index];
    updatedServices.splice(index, 1);
    
    // Update ordering for remaining services
    updatedServices.forEach((service, idx) => {
      service.ordering = idx + 1;
    });
    
    setServices(updatedServices);
    
    // If the service has an ID, delete it from the database
    if (removedService.id) {
      deleteMutation.mutate(removedService.id);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save main heading content
      const headingContent = servicesContent?.find(item => item.ordering === 0);
      if (headingContent) {
        await updateMutation.mutateAsync({
          id: headingContent.id,
          updates: {
            title: heading,
            subtitle: subheading,
            is_published: true
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'services',
          title: heading,
          subtitle: subheading,
          is_published: true,
          ordering: 0
        });
      }
      
      // Save each service item
      for (const service of services) {
        if (service.id) {
          // Update existing service
          await updateMutation.mutateAsync({
            id: service.id,
            updates: {
              title: service.title,
              content: service.description,
              media_url: service.icon,
              ordering: service.ordering,
              is_published: true
            }
          });
        } else {
          // Create new service
          await createMutation.mutateAsync({
            section: 'services',
            title: service.title,
            content: service.description,
            media_url: service.icon,
            ordering: service.ordering,
            is_published: true
          });
        }
      }
      
      toast({
        title: "Services content saved",
        description: "Your services section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving services content:', error);
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
          Error loading services content. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Services Section Heading</CardTitle>
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
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Items</CardTitle>
          <Button 
            onClick={handleAddService} 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {services.map((service, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Service {index + 1}</h3>
                <Button 
                  onClick={() => handleRemoveService(index)} 
                  size="sm" 
                  variant="destructive"
                  className="h-8 w-8 p-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`service-title-${index}`}>Title</Label>
                <Input 
                  id={`service-title-${index}`}
                  value={service.title} 
                  onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                  placeholder="Service title" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`service-description-${index}`}>Description</Label>
                <Textarea 
                  id={`service-description-${index}`}
                  value={service.description} 
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  placeholder="Service description"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`service-icon-${index}`}>Icon</Label>
                <Input 
                  id={`service-icon-${index}`}
                  value={service.icon} 
                  onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                  placeholder="Icon name (e.g., Video, Camera, Film, Edit)" 
                />
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No services added yet. Click "Add Service" to get started.</p>
            </div>
          )}
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
                <span>Save All Services</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServicesEditor;
