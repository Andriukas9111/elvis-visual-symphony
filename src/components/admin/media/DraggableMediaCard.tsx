
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDrag, useDrop } from 'react-dnd';
import { Star, Pencil, Trash, ArrowUp, ArrowDown } from 'lucide-react';

interface DraggableMediaCardProps {
  item: any;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onEdit: () => void;
  onToggleFeatured: (id: string, status: boolean) => void;
  onTogglePublish: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
}

export const DraggableMediaCard: React.FC<DraggableMediaCardProps> = ({
  item,
  index,
  moveItem,
  onEdit,
  onToggleFeatured,
  onTogglePublish,
  onDelete,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'MEDIA_ITEM',
    item: () => {
      return { id: item.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'MEDIA_ITEM',
    hover(hoveredItem: { id: string, index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = hoveredItem.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Get the rectangle of the current card
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get the vertical middle of the card
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Get the mouse position relative to the card
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get the pixel distance from the top of the card
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      hoveredItem.index = hoverIndex;
    },
  });

  drag(drop(ref));
  
  const isVertical = item.orientation === 'vertical';

  return (
    <Card 
      ref={ref}
      key={item.id} 
      className={`bg-elvis-light border-none overflow-hidden group transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="relative aspect-video overflow-hidden cursor-move">
        <img 
          src={item.thumbnail_url || item.url || 'https://via.placeholder.com/300x169'} 
          alt={item.title}
          className={`w-full h-full ${isVertical ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <Badge className={`absolute top-2 right-2 ${item.is_published ? 
          'bg-green-500/10 text-green-500' : 
          'bg-yellow-500/10 text-yellow-500'}`}
        >
          {item.is_published ? 'Published' : 'Draft'}
        </Badge>
        
        {item.is_featured && (
          <Badge className="absolute top-2 left-2 bg-purple-500/10 text-purple-500">
            Featured
          </Badge>
        )}
        
        <Badge className="absolute bottom-2 left-2 bg-gray-500/20 text-gray-200">
          #{item.sort_order || '?'}
        </Badge>
        
        {isVertical && (
          <Badge className="absolute bottom-2 right-2 bg-blue-500/10 text-blue-400">
            Vertical
          </Badge>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2">
            <Button 
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => moveItem(index, Math.max(0, index - 1))}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => moveItem(index, index + 1)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-white truncate">{item.title}</h3>
        <p className="text-sm text-white/60 mb-2">{item.type} • {item.category}</p>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onTogglePublish(item.id, item.is_published)}
            className="hover:bg-elvis-pink/20 text-xs w-full"
          >
            {item.is_published ? 'Unpublish' : 'Publish'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit()}
            className="hover:bg-elvis-pink/20 text-xs w-full"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onToggleFeatured(item.id, item.is_featured)}
            className="hover:bg-elvis-pink/20 text-xs w-full"
          >
            <Star className={`h-3 w-3 mr-1 ${item.is_featured ? 'text-yellow-500 fill-yellow-500' : ''}`} />
            {item.is_featured ? 'Unfeature' : 'Feature'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(item.id)}
            className="hover:bg-red-500/20 text-xs w-full text-red-400"
          >
            <Trash className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
