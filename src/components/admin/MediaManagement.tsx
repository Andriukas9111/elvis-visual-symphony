
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
import { useToast } from '@/components/ui/use-toast';
import { Loader2, GridIcon, ListIcon, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MediaManagement = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('media')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setMedia(data || []);
        
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
    
    fetchMedia();
  }, [toast]);
  
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
        
        <Button className="bg-elvis-pink hover:bg-elvis-pink-800">
          <Plus className="mr-2 h-4 w-4" />
          Add New Media
        </Button>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card 
              key={item.id} 
              className="bg-elvis-light border-none overflow-hidden group"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
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
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-white truncate">{item.title}</h3>
                <p className="text-sm text-white/60 mb-2">{item.type} • {item.category}</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => togglePublishStatus(item.id, item.is_published)}
                    className="hover:bg-elvis-pink/20 text-xs w-full"
                  >
                    {item.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-elvis-pink/20 text-xs w-full"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Media</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {media.map((item) => (
                <TableRow key={item.id} className="border-white/10 hover:bg-elvis-light/50 transition-colors">
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
                    <Badge className={item.is_published ? 
                      'bg-green-500/10 text-green-500' : 
                      'bg-yellow-500/10 text-yellow-500'}>
                      {item.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                        className="hover:bg-elvis-pink/20"
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
