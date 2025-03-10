
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLoadingState from '../AdminLoadingState';
import { Plus, Trash2 } from 'lucide-react';
import { useExpertise, useCreateExpertise, useUpdateExpertise, useDeleteExpertise } from '@/hooks/api/useExpertise';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ExpertiseEditor = () => {
  const [activeTab, setActiveTab] = useState<string>('expertise');
  
  const { data: expertiseData, isLoading: expertiseLoading } = useExpertise('expertise');
  const { data: projectData, isLoading: projectsLoading } = useExpertise('project');
  
  const createExpertiseMutation = useCreateExpertise();
  const updateExpertiseMutation = useUpdateExpertise();
  const deleteExpertiseMutation = useDeleteExpertise();
  
  const isLoading = expertiseLoading || projectsLoading;
  
  const handleItemChange = (id: string, field: string, value: any) => {
    updateExpertiseMutation.mutate({
      id,
      updates: { [field]: value }
    });
  };
  
  const addItem = (type: 'expertise' | 'project') => {
    const newItem = {
      icon_name: type === 'expertise' ? 'Camera' : 'Video',
      label: type === 'expertise' ? 'New Expertise' : 'New Project',
      description: 'Add a description here',
      type,
      sort_order: (type === 'expertise' ? expertiseData?.length : projectData?.length) || 0
    };
    
    createExpertiseMutation.mutate(newItem, {
      onSuccess: () => {
        toast.success(`New ${type} added successfully`);
      }
    });
  };
  
  const removeItem = (id: string, type: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      deleteExpertiseMutation.mutate(id, {
        onSuccess: () => {
          toast.success(`${type} deleted successfully`);
        }
      });
    }
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = activeTab === 'expertise' ? 
      Array.from(expertiseData || []) : 
      Array.from(projectData || []);
      
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update sort order for all items
    items.forEach((item, index) => {
      updateExpertiseMutation.mutate({
        id: item.id,
        updates: { sort_order: index }
      });
    });
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expertise & Projects</CardTitle>
          <CardDescription>Manage the expertise and projects displayed in the About section</CardDescription>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="expertise" className="mt-0 space-y-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="expertise">
                {(provided) => (
                  <div
                    className="space-y-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {expertiseData?.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 border rounded-md space-y-3"
                          >
                            <div className="flex justify-between">
                              <Label>Expertise Item {index + 1}</Label>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => removeItem(item.id, 'expertise')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`icon-${item.id}`}>Icon Name</Label>
                              <Input
                                id={`icon-${item.id}`}
                                value={item.icon_name}
                                onChange={(e) => handleItemChange(item.id, 'icon_name', e.target.value)}
                                placeholder="Icon name (e.g. Camera, Video)"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`label-${item.id}`}>Label</Label>
                              <Input
                                id={`label-${item.id}`}
                                value={item.label}
                                onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
                                placeholder="Title of expertise"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`desc-${item.id}`}>Description</Label>
                              <Textarea
                                id={`desc-${item.id}`}
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                placeholder="Description of expertise"
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => addItem('expertise')}
            >
              <Plus className="h-4 w-4" />
              Add Expertise
            </Button>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-0 space-y-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="projects">
                {(provided) => (
                  <div
                    className="space-y-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {projectData?.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 border rounded-md space-y-3"
                          >
                            <div className="flex justify-between">
                              <Label>Project Item {index + 1}</Label>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => removeItem(item.id, 'project')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`icon-${item.id}`}>Icon Name</Label>
                              <Input
                                id={`icon-${item.id}`}
                                value={item.icon_name}
                                onChange={(e) => handleItemChange(item.id, 'icon_name', e.target.value)}
                                placeholder="Icon name (e.g. Camera, Video)"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`label-${item.id}`}>Title</Label>
                              <Input
                                id={`label-${item.id}`}
                                value={item.label}
                                onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
                                placeholder="Title of project"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`desc-${item.id}`}>Description</Label>
                              <Textarea
                                id={`desc-${item.id}`}
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                placeholder="Description of project"
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => addItem('project')}
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </TabsContent>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Changes are automatically saved when you edit each item
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpertiseEditor;
