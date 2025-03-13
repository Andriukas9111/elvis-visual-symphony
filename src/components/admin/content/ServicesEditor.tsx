
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Save, 
  PlusCircle, 
  Trash, 
  ArrowUpDown, 
  MoveUp,
  MoveDown
} from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent, useDeleteContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

const ServicesEditor = () => {
  const { toast } = useToast();
  const { data: servicesContent, isLoading, error } = useContent('services');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  const deleteMutation = useDeleteContent();
  
  const [sectionHeading, setSectionHeading] = useState('');
  const [sectionSubheading, setSectionSubheading] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (servicesContent && servicesContent.length > 0) {
      // Find section header content - usually with lowest order or id 'services-header'
      const headerContent = servicesContent.find(item => 
        item.ordering === 0 || item.id.includes('header')
      );
      
      if (headerContent) {
        setSectionHeading(headerContent.title || '');
        setSectionSubheading(headerContent.subtitle || '');
      }
      
      // Get all service items (filtering out the header)
      const serviceItems = servicesContent
        .filter(item => item.ordering > 0 || !item.id.includes('header'))
        .sort((a, b) => (a.ordering || 0) - (b.ordering || 0));
      
      setServices(serviceItems);
    }
  }, [servicesContent]);

  const handleSaveSection = async () => {
    setIsSaving(true);
    
    try {
      // Find or create the section header
      const headerContent = servicesContent?.find(item => 
        item.ordering === 0 || item.id.includes('header')
      );
      
      if (headerContent) {
        await updateMutation.mutateAsync({
          id: headerContent.id,
          updates: {
            title: sectionHeading,
            subtitle: sectionSubheading
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'services',
          title: sectionHeading,
          subtitle: sectionSubheading,
          is_published: true,
          ordering: 0
        });
      }
      
      toast({
        title: "Services section updated",
        description: "Your services section header has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving services section:', error);
      toast({
        title: "Error saving content",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddService = async () => {
    // Calculate the next order number
    const nextOrder = services.length > 0 
      ? Math.max(...services.map(s => s.ordering || 0)) + 1 
      : 1;
    
    const newService = {
      section: 'services',
      title: 'New Service',
      content: 'Description for the new service',
      is_published: true,
      ordering: nextOrder
    };
    
    try {
      const createdService = await createMutation.mutateAsync(newService);
      setServices([...services, createdService]);
      
      toast({
        title: "Service added",
        description: "New service has been added. You can now edit its details."
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error adding service",
        description: "There was a problem adding the new service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setServices(updatedServices);
  };

  const handleSaveService = async (service: any) => {
    try {
      await updateMutation.mutateAsync({
        id: service.id,
        updates: {
          title: service.title,
          content: service.content,
          media_url: service.media_url,
          is_published: service.is_published
        }
      });
      
      toast({
        title: "Service updated",
        description: `"${service.title}" has been updated successfully.`
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error updating service",
        description: "There was a problem updating the service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
      
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error deleting service",
        description: "There was a problem deleting the service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMoveService = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === services.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedServices = [...services];
    
    // Swap the ordering values
    const currentOrdering = updatedServices[index].ordering;
    updatedServices[index].ordering = updatedServices[newIndex].ordering;
    updatedServices[newIndex].ordering = currentOrdering;
    
    // Swap the positions in the array
    [updatedServices[index], updatedServices[newIndex]] = 
      [updatedServices[newIndex], updatedServices[index]];
    
    // Update the state first for immediate UI feedback
    setServices(updatedServices);
    
    // Now update both services in the database
    try {
      await Promise.all([
        updateMutation.mutateAsync({
          id: updatedServices[index].id,
          updates: { ordering: updatedServices[index].ordering }
        }),
        updateMutation.mutateAsync({
          id: updatedServices[newIndex].id,
          updates: { ordering: updatedServices[newIndex].ordering }
        })
      ]);
    } catch (error) {
      console.error('Error reordering services:', error);
      toast({
        title: "Error reordering services",
        description: "There was a problem updating the order. Please try again.",
        variant: "destructive"
      });
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
          <CardTitle>Services Section Header</CardTitle>
          <CardDescription>
            Edit the main heading and subheading for the services section
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionHeading">Section Heading</Label>
            <Input 
              id="sectionHeading" 
              value={sectionHeading} 
              onChange={(e) => setSectionHeading(e.target.value)}
              placeholder="Enter section heading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sectionSubheading">Section Subheading</Label>
            <Textarea 
              id="sectionSubheading" 
              value={sectionSubheading} 
              onChange={(e) => setSectionSubheading(e.target.value)}
              placeholder="Enter section subheading" 
              rows={2}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSaveSection} 
            disabled={isSaving}
            variant="outline"
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
                <span>Save Header</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Services</h3>
        <Button 
          onClick={handleAddService} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Service</span>
        </Button>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {services.map((service, index) => (
            <Card key={service.id} className="border border-muted">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    Service #{index + 1}: {service.title}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveService(index, 'up')}
                      className="h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                      <span className="sr-only">Move up</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={index === services.length - 1}
                      onClick={() => handleMoveService(index, 'down')}
                      className="h-8 w-8 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                      <span className="sr-only">Move down</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`service-${index}-title`}>Title</Label>
                  <Input 
                    id={`service-${index}-title`} 
                    value={service.title || ''} 
                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    placeholder="Service title" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-${index}-description`}>Description</Label>
                  <Textarea 
                    id={`service-${index}-description`} 
                    value={service.content || ''} 
                    onChange={(e) => handleServiceChange(index, 'content', e.target.value)}
                    placeholder="Service description" 
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-${index}-icon`}>Icon/Image URL</Label>
                  <Input 
                    id={`service-${index}-icon`} 
                    value={service.media_url || ''} 
                    onChange={(e) => handleServiceChange(index, 'media_url', e.target.value)}
                    placeholder="URL to an icon or image" 
                  />
                  <p className="text-xs text-muted-foreground">
                    This can be a full URL to an image or an icon name from Lucide icons
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`service-${index}-published`}
                    checked={service.is_published}
                    onCheckedChange={(checked) => handleServiceChange(index, 'is_published', checked)}
                  />
                  <Label htmlFor={`service-${index}-published`}>Published</Label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleSaveService(service)} 
                  variant="default"
                  size="sm"
                  className="ml-auto flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Service</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {services.length === 0 && (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No services have been added yet.</p>
                <Button 
                  onClick={handleAddService} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Your First Service</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServicesEditor;
