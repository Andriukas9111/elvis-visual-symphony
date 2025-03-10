
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Pencil, 
  Trash, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface MediaListProps {
  filteredMedia: any[];
  onEdit: (media: any) => void;
  onToggleFeatured: (id: string, status: boolean) => void;
  onTogglePublish: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
}

const MediaList: React.FC<MediaListProps> = ({ 
  filteredMedia, 
  onEdit, 
  onToggleFeatured, 
  onTogglePublish, 
  onDelete,
  onMove
}) => {
  return (
    <div className="rounded-md border border-white/10 overflow-hidden">
      <Table>
        <TableHeader className="bg-elvis-dark">
          <TableRow>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead className="w-[100px]">Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">Featured</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMedia.map((item, index) => (
            <TableRow key={item.id} className="border-t border-white/10 hover:bg-elvis-dark/50">
              <TableCell className="font-mono">
                <div className="flex items-center space-x-1">
                  <span className="text-white/60">#{item.sort_order || '?'}</span>
                  {onMove && (
                    <div className="flex flex-col ml-2">
                      <button 
                        onClick={() => onMove(index, Math.max(0, index - 1))}
                        className="text-white/40 hover:text-white"
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => onMove(index, Math.min(filteredMedia.length - 1, index + 1))}
                        className="text-white/40 hover:text-white"
                        disabled={index === filteredMedia.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className={`w-16 h-9 ${item.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} rounded overflow-hidden bg-elvis-dark relative`}>
                  <img 
                    src={item.thumbnail_url || item.url} 
                    alt={item.title}
                    className={`w-full h-full ${item.orientation === 'vertical' ? 'object-contain' : 'object-cover'}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg'; 
                    }}
                  />
                  {item.orientation === 'vertical' && (
                    <div className="absolute bottom-0 right-0 bg-blue-500/80 text-white p-0.5 text-[8px] rounded-tl">
                      V
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-white">{item.title}</div>
                <div className="text-xs text-white/60 truncate max-w-[300px]">
                  {item.description || 'No description'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
                {item.category && (
                  <Badge variant="outline" className="ml-1 capitalize text-[10px]">
                    {item.category}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge className={item.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {item.is_published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost" 
                  size="sm"
                  className={`w-full justify-start ${item.is_featured ? 'text-yellow-400' : 'text-white/60'}`}
                  onClick={() => onToggleFeatured(item.id, item.is_featured)}
                >
                  <Star className={`h-4 w-4 mr-1 ${item.is_featured ? 'fill-yellow-400' : ''}`} />
                  {item.is_featured ? 'Featured' : 'Not Featured'}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="outline" size="icon" onClick={() => onTogglePublish(item.id, item.is_published)}>
                    {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-400 hover:text-red-300" onClick={() => onDelete(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredMedia.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-white/60">
                No media items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MediaList;
