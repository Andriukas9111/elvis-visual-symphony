
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDrag, useDrop } from 'react-dnd';
import { Star, Pencil, Trash } from 'lucide-react';

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
      
      moveItem(dragIndex, hoverIndex);
      
      hoveredItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Card 
      ref={ref}
      key={item.id} 
      className={`bg-elvis-light border-none overflow-hidden group transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden cursor-move">
        <img 
          src={item.thumbnail_url || item.media_url || 'https://via.placeholder.com/300x169'} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
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
          Order: {item.sort_order}
        </Badge>
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
