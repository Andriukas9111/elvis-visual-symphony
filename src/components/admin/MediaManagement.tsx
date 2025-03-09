
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  GridIcon, 
  ListIcon, 
  Plus, 
  Search,
  Upload,
  Edit,
  Star,
  Trash,
  Sparkles,
  MoveIcon,
  Pencil,
  Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MediaUploader from './MediaUploader';
import MediaEditor from './MediaEditor';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { updateMediaSortOrder } from '@/lib/api';

const ItemTypes = {
  MEDIA_ITEM: 'mediaItem',
};

const DraggableMediaCard = ({ item, index, moveItem, onEdit, onToggleFeatured, onTogglePublish, onDelete }) => {
  const ref = React.useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.MEDIA_ITEM,
    item: () => {
      return { id: item.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.MEDIA_ITEM,
    hover(hoveredItem: { id: string, index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = hoveredItem.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Move the item
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
            onClick={() => onEdit(item)}
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

const MediaManagement = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<any[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMedia(data || []);
      
      // Extract unique categories
      const categories = Array.from(
        new Set((data || []).map(item => item.category))
      ).filter(Boolean) as string[];
      
      setAvailableCategories(categories);
      
    } catch (error: any) {
      console.error('Error fetching media:', error.message);
      toast({
        title: 'Error loading media',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMedia();
  }, [toast]);
  
  // Filter media when search or category changes
  useEffect(() => {
    let filtered = [...media];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredMedia(filtered);
  }, [media, searchQuery, categoryFilter]);
  
  const togglePublishStatus = async (mediaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ is_published: !currentStatus })
        .eq('id', mediaId);
        
      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Media item is now ${!currentStatus ? 'published' : 'unpublished'}`,
      });
      
      // Update media in local state to avoid refetching
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_published: !currentStatus } : item
        )
      );
      
    } catch (error: any) {
      console.error('Error updating media status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const toggleFeaturedStatus = async (mediaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ is_featured: !currentStatus })
        .eq('id', mediaId);
        
      if (error) throw error;
      
      toast({
        title: currentStatus ? 'Removed from featured' : 'Added to featured',
        description: `Media item is now ${!currentStatus ? 'featured' : 'unfeatured'}`,
      });
      
      // Update media in local state to avoid refetching
      setMedia(prevMedia => 
        prevMedia.map(item => 
          item.id === mediaId ? { ...item, is_featured: !currentStatus } : item
        )
      );
      
    } catch (error: any) {
      console.error('Error updating featured status:', error.message);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const deleteMedia = async (mediaId: string) => {
    try {
      // Get the media item first to get the file path
      const { data: mediaItem, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('id', mediaId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete from the database
      const { error: deleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId);
        
      if (deleteError) throw deleteError;
      
      // TODO: Delete from storage if needed
      // This would require extracting the path from the URL and using storage.remove()
      
      toast({
        title: 'Media deleted',
        description: 'The media item has been successfully deleted.',
      });
      
      // Update media in local state to avoid refetching
      setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));
      
    } catch (error: any) {
      console.error('Error deleting media:', error.message);
      toast({
        title: 'Error deleting media',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleMediaUpload = (newMedia: any) => {
    setMedia(prevMedia => [newMedia, ...prevMedia]);
    setIsUploadModalOpen(false);
  };
  
  const handleMediaUpdate = (updatedMedia: any) => {
    setMedia(prevMedia => 
      prevMedia.map(item => 
        item.id === updatedMedia.id ? updatedMedia : item
      )
    );
    setEditingMedia(null);
  };
  
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = filteredMedia[dragIndex];
    
    setFilteredMedia(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      return updatedItems;
    });
    
    // Mark that we have unsaved changes that need to be persisted
    setHasUnsavedChanges(true);
  };

  const saveOrder = async () => {
    if (!hasUnsavedChanges) return;
    
    try {
      setIsSaving(true);
      
      // Create updates array with new sort orders
      const updates = filteredMedia.map((item, index) => ({
        id: item.id,
        sort_order: index + 1 // Start from 1 for better readability
      }));
      
      // Update the database
      await updateMediaSortOrder(updates);
      
      // Update local state
      setMedia(prevMedia => {
        const updatedMedia = [...prevMedia];
        
        // Create a map of id to sort_order for quick lookup
        const sortOrderMap = new Map();
        updates.forEach(update => sortOrderMap.set(update.id, update.sort_order));
        
        // Update the sort_order for each item
        return updatedMedia.map(item => ({
          ...item,
          sort_order: sortOrderMap.has(item.id) ? sortOrderMap.get(item.id) : item.sort_order
        }));
      });
      
      toast({
        title: 'Order saved',
        description: 'The new display order has been saved successfully.',
      });
      
      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error('Error saving order:', error.message);
      toast({
        title: 'Error saving order',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-grow">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-elvis-light border-white/10"
              />
            </div>
            
            <div className="md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-elvis-light border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-elvis-pink"
              >
                <option value="">All categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-elvis-pink hover:bg-elvis-pink-800' : ''}
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-elvis-pink hover:bg-elvis-pink-800' : ''}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={saveOrder}
                disabled={isSaving}
              >
                {isSaving ? (
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
            
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-elvis-pink hover:bg-elvis-pink-800 whitespace-nowrap">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-elvis-medium border-white/10 max-w-xl">
                <MediaUploader onUploadComplete={handleMediaUpload} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-md p-3 flex items-center gap-2">
            <p className="text-yellow-200 text-sm">
              You've changed the order of your media items. Don't forget to save your changes!
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/20"
              onClick={saveOrder}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Saving
                </>
              ) : (
                'Save Now'
              )}
            </Button>
          </div>
        )}
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item, index) => (
              <DraggableMediaCard
                key={item.id}
                item={item}
                index={index}
                moveItem={moveItem}
                onEdit={() => setEditingMedia(item)}
                onToggleFeatured={toggleFeaturedStatus}
                onTogglePublish={togglePublishStatus}
                onDelete={deleteMedia}
              />
            ))}
          </div>
        ) : (
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
                {filteredMedia.map((item, index) => (
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
                          onClick={() => setEditingMedia(item)}
                          className="hover:bg-elvis-pink/20"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => togglePublishStatus(item.id, item.is_published)}
                          className="hover:bg-elvis-pink/20"
                        >
                          {item.is_published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleFeaturedStatus(item.id, item.is_featured)}
                          className="hover:bg-elvis-pink/20"
                        >
                          <Star className={`h-4 w-4 mr-1 ${item.is_featured ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          {item.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteMedia(item.id)}
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
        )}
        
        {/* Media Editor Dialog */}
        <Dialog open={!!editingMedia} onOpenChange={(open) => !open && setEditingMedia(null)}>
          <DialogContent className="bg-elvis-medium border-white/10 max-w-xl">
            {editingMedia && (
              <MediaEditor 
                media={editingMedia} 
                onUpdate={handleMediaUpdate}
                onClose={() => setEditingMedia(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default MediaManagement;
