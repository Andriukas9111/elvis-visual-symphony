
import React from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  useSortable, 
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Save, Loader2 } from 'lucide-react';

interface MediaOrderingProps {
  mediaItems: any[];
  onOrderChange: (newOrder: any[]) => void;
  isLoading?: boolean;
  onSave?: () => Promise<void>;
  hasUnsavedChanges?: boolean;
}

// SortableItem component for rendering each draggable card
const SortableItem = ({ item, index }: { item: any; index: number }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`mb-2 ${isDragging ? 'ring ring-elvis-pink/40' : ''}`}
    >
      <Card className="p-3 bg-elvis-dark hover:bg-elvis-medium transition-colors flex items-center">
        <div 
          className="mr-2 cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-elvis-pink/10"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-white/60" />
        </div>
        
        <div className="flex-1 flex items-center overflow-hidden">
          {item.thumbnail_url && (
            <div className="h-10 w-16 mr-3 rounded overflow-hidden flex-shrink-0">
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <div className="min-w-0 overflow-hidden">
            <p className="text-sm font-medium truncate">{item.title}</p>
            <p className="text-xs text-white/60 truncate">
              {item.type} • {item.category}
            </p>
          </div>
        </div>
        
        <div className="ml-2 text-sm text-white/40">
          #{index + 1}
        </div>
      </Card>
    </div>
  );
};

const MediaOrdering: React.FC<MediaOrderingProps> = ({ 
  mediaItems,
  onOrderChange,
  isLoading = false,
  onSave,
  hasUnsavedChanges = false
}) => {
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before a drag starts
      },
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = mediaItems.findIndex(item => item.id === active.id);
      const overIndex = mediaItems.findIndex(item => item.id === over.id);
      
      // Reorder the array
      const newOrder = arrayMove(mediaItems, activeIndex, overIndex);
      
      // Call the parent component with the new order
      onOrderChange(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Media Order</h3>
        
        {onSave && (
          <Button 
            variant="default" 
            size="sm"
            onClick={onSave}
            disabled={isLoading || !hasUnsavedChanges}
            className="bg-elvis-pink hover:bg-elvis-pink/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Order
              </>
            )}
          </Button>
        )}
      </div>
      
      <p className="text-sm text-white/60">
        Drag and drop items to reorder. The order will be reflected on the frontend.
      </p>
      
      <DndContext 
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={mediaItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-2">
            {mediaItems.map((item, index) => (
              <SortableItem 
                key={item.id} 
                item={item} 
                index={index} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {mediaItems.length === 0 && (
        <div className="text-center py-8 text-white/40">
          No media items to order. Add some media first.
        </div>
      )}
    </div>
  );
};

export default MediaOrdering;
