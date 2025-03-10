
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Star, Trash } from 'lucide-react';

interface MediaListProps {
  filteredMedia: any[];
  onEdit: (item: any) => void;
  onToggleFeatured: (id: string, status: boolean) => void;
  onTogglePublish: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
}

const MediaList: React.FC<MediaListProps> = ({
  filteredMedia,
  onEdit,
  onToggleFeatured,
  onTogglePublish,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="w-12">Order</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMedia.map((item) => (
            <TableRow key={item.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
              <TableCell className="font-mono text-sm">
                {item.sort_order || '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded overflow-hidden">
                    <img 
                      src={item.thumbnail_url || item.media_url || 'https://via.placeholder.com/48'} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-white/60">{item.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge className={item.is_published ? 
                    'bg-green-500/10 text-green-500' : 
                    'bg-yellow-500/10 text-yellow-500'}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </Badge>
                  {item.is_featured && (
                    <Badge className="bg-purple-500/10 text-purple-500">
                      Featured
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="hover:bg-elvis-pink/20"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onTogglePublish(item.id, item.is_published)}
                    className="hover:bg-elvis-pink/20"
                  >
                    {item.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onToggleFeatured(item.id, item.is_featured)}
                    className="hover:bg-elvis-pink/20"
                  >
                    <Star className={`h-4 w-4 mr-1 ${item.is_featured ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                    {item.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="hover:bg-red-500/20 text-red-400"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MediaList;
