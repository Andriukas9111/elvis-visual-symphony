
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Loader2 } from 'lucide-react';
import MediaUploader from './MediaUploader';
import MediaEditor from './MediaEditor';
import { useMediaManagement } from '@/hooks/useMediaManagement';
import { useMediaFilters } from '@/hooks/useMediaFilters';
import MediaToolbar from './media/MediaToolbar';
import { DraggableMediaCard } from './media/DraggableMediaCard';
import MediaList from './media/MediaList';

const MediaManagement = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  
  const {
    media,
    setMedia,
    isLoading,
    availableCategories,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    fetchMedia,
    togglePublishStatus,
    toggleFeaturedStatus,
    deleteMedia,
    saveOrder
  } = useMediaManagement();

  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    viewMode,
    setViewMode,
    filteredMedia
  } = useMediaFilters(media);

  useEffect(() => {
    fetchMedia();
  }, []);

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
    
    const newFilteredMedia = [...filteredMedia];
    newFilteredMedia.splice(dragIndex, 1);
    newFilteredMedia.splice(hoverIndex, 0, draggedItem);
    
    setMedia(prevItems => {
      const updatedItems = [...prevItems];
      const itemOrder = new Map(newFilteredMedia.map((item, index) => [item.id, index]));
      
      return updatedItems.sort((a, b) => {
        const orderA = itemOrder.get(a.id) ?? Number.MAX_VALUE;
        const orderB = itemOrder.get(b.id) ?? Number.MAX_VALUE;
        return orderA - orderB;
      });
    });
    
    setHasUnsavedChanges(true);
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
        <MediaToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          availableCategories={availableCategories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={saveOrder}
          setIsUploadModalOpen={setIsUploadModalOpen}
        />
        
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
          <MediaList
            filteredMedia={filteredMedia}
            onEdit={setEditingMedia}
            onToggleFeatured={toggleFeaturedStatus}
            onTogglePublish={togglePublishStatus}
            onDelete={deleteMedia}
          />
        )}
        
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="bg-elvis-medium border-white/10 max-w-xl">
            <MediaUploader onUploadComplete={handleMediaUpload} />
          </DialogContent>
        </Dialog>
        
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
