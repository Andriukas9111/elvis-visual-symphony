
import React, { useState, useEffect } from 'react';
import { useMedia } from '@/hooks/useMedia';
import { Tables } from '@/types/supabase';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, CheckCircle2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Tables<'media'>) => void;
  multiSelect?: boolean;
  selectedMediaIds?: string[];
}

const MediaSelector: React.FC<MediaSelectorProps> = ({ 
  open, 
  onClose, 
  onSelect, 
  multiSelect = false,
  selectedMediaIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>(selectedMediaIds);
  
  // Reset selected media when the dialog opens with new selectedMediaIds
  useEffect(() => {
    if (open) {
      setSelectedMedia(selectedMediaIds);
    }
  }, [open, selectedMediaIds]);
  
  const { data: mediaItems, isLoading, error } = useMedia({
    search: searchTerm,
    limit: 50
  });
  
  const handleSelect = (media: Tables<'media'>) => {
    if (multiSelect) {
      // For multi-select, toggle the selection
      if (selectedMedia.includes(media.id)) {
        setSelectedMedia(selectedMedia.filter(id => id !== media.id));
      } else {
        setSelectedMedia([...selectedMedia, media.id]);
      }
    } else {
      // For single select, just close and return the selection
      onSelect(media);
      onClose();
    }
  };
  
  const handleDone = () => {
    if (multiSelect && mediaItems) {
      // Find all selected media objects
      const selectedItems = mediaItems.filter(item => selectedMedia.includes(item.id));
      selectedItems.forEach(item => onSelect(item));
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            {multiSelect 
              ? 'Select one or more media items from your library.' 
              : 'Select a media item from your library.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[400px] flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">
              Error loading media items
            </div>
          ) : mediaItems && mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mediaItems.map((media) => (
                <div 
                  key={media.id} 
                  className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                    selectedMedia.includes(media.id) 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-muted'
                  }`}
                  onClick={() => handleSelect(media)}
                >
                  <div className="aspect-video bg-muted relative">
                    {media.thumbnail_url ? (
                      <img 
                        src={media.thumbnail_url} 
                        alt={media.title || 'Media'} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No thumbnail
                      </div>
                    )}
                    
                    {selectedMedia.includes(media.id) && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full text-primary-foreground">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-card text-xs truncate">
                    {media.title || 'Untitled'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No media items found. Try a different search term or add new media.
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="flex items-center">
          {multiSelect && (
            <div className="text-sm text-muted-foreground mr-auto">
              {selectedMedia.length} items selected
            </div>
          )}
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          {multiSelect && (
            <Button onClick={handleDone}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaSelector;
