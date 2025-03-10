
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
import { Label } from "@/components/ui/label";
import AdminLoadingState from '../AdminLoadingState';
import { Plus, Trash2 } from 'lucide-react';
import { useStats, useCreateStat, useUpdateStat, useDeleteStat } from '@/hooks/api/useStats';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const StatsEditor = () => {
  const { data: stats, isLoading } = useStats();
  const createStatMutation = useCreateStat();
  const updateStatMutation = useUpdateStat();
  const deleteStatMutation = useDeleteStat();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleStatChange = (id: string, field: string, value: any) => {
    updateStatMutation.mutate({
      id,
      updates: { [field]: value }
    });
  };
  
  const addStat = () => {
    createStatMutation.mutate({
      icon_name: 'Star',
      value: 0,
      suffix: '',
      label: 'New Stat',
      sort_order: stats?.length || 0
    });
  };
  
  const removeStat = (id: string) => {
    if (confirm('Are you sure you want to delete this stat?')) {
      deleteStatMutation.mutate(id);
    }
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination || !stats) return;
    
    const items = Array.from(stats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update sort order for all items
    items.forEach((item, index) => {
      updateStatMutation.mutate({
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stats Editor</CardTitle>
              <CardDescription>Manage the statistics displayed in the About section</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="stats">
              {(provided) => (
                <div
                  className="space-y-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {stats?.map((stat, index) => (
                    <Draggable key={stat.id} draggableId={stat.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex flex-col sm:flex-row gap-3 p-4 border rounded-md"
                        >
                          <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor={`iconName-${index}`}>Icon Name</Label>
                              <Input
                                id={`iconName-${index}`}
                                value={stat.icon_name}
                                onChange={(e) => handleStatChange(stat.id, 'icon_name', e.target.value)}
                                placeholder="Icon name (e.g. Camera, Video, Award)"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`label-${index}`}>Label</Label>
                              <Input
                                id={`label-${index}`}
                                value={stat.label}
                                onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                                placeholder="Label (e.g. Photo Projects)"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor={`value-${index}`}>Value</Label>
                              <Input
                                id={`value-${index}`}
                                type="number"
                                value={stat.value}
                                onChange={(e) => handleStatChange(stat.id, 'value', parseInt(e.target.value) || 0)}
                                placeholder="Numeric value"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`suffix-${index}`}>Suffix</Label>
                              <Input
                                id={`suffix-${index}`}
                                value={stat.suffix}
                                onChange={(e) => handleStatChange(stat.id, 'suffix', e.target.value)}
                                placeholder="Suffix (e.g. +, %)"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => removeStat(stat.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
            className="w-full flex items-center justify-center gap-2 mt-4"
            onClick={addStat}
          >
            <Plus className="h-4 w-4" />
            Add Stat
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Stats are automatically saved when you make changes
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StatsEditor;
