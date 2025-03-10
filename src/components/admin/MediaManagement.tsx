
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
  const [lastOrderSave, setLastOrderSave] = useState<string | null>(null);
  
  const {
    media,
    setMedia,
    filteredMedia,
    setFilteredMedia,
    isLoading,
    availableCategories,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    orderUpdateLogs,
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
    filteredMedia: filterResults,
    applyFilters
  } = useMediaFilters(media);

  // Update filtered media when filter results change
  useEffect(() => {
    setFilteredMedia(filterResults);
  }, [filterResults, setFilteredMedia]);

  useEffect(() => {
    fetchMedia();
  }, []);

  // When last successful save happens, record the timestamp
  useEffect(() => {
    if (!isSaving && !hasUnsavedChanges && orderUpdateLogs.length > 0) {
      const lastLog = orderUpdateLogs[orderUpdateLogs.length - 1];
      setLastOrderSave(new Date(lastLog.timestamp).toLocaleTimeString());
    }
  }, [isSaving, hasUnsavedChanges, orderUpdateLogs]);

  const handleMediaUpload = (newMedia: any) => {
    setMedia(prevMedia => [newMedia, ...prevMedia]);
    setIsUploadModalOpen(false);
    
    // Fetch media again to ensure everything is up to date
    setTimeout(() => {
      fetchMedia();
    }, 1000);
  };
  
  const handleMediaUpdate = (updatedMedia: any) => {
    setMedia(prevMedia => 
      prevMedia.map(item => 
        item.id === updatedMedia.id ? updatedMedia : item
      )
    );
    setEditingMedia(null);
    
    // Re-apply filters to ensure UI is consistent
    applyFilters(searchQuery, categoryFilter);
  };
  
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    // Safety check - ensure indices are within bounds
    if (
      dragIndex < 0 || 
      dragIndex >= filteredMedia.length || 
      hoverIndex < 0 || 
      hoverIndex >= filteredMedia.length
    ) {
      console.warn('Invalid move indices:', { dragIndex, hoverIndex, length: filteredMedia.length });
      return;
    }
    
    const draggedItem = filteredMedia[dragIndex];
    
    console.log('Moving item:', {
      from: dragIndex,
      to: hoverIndex,
      item: { id: draggedItem.id, title: draggedItem.title }
    });
    
    // Create a copy of the filtered media array
    const newFilteredMedia = [...filteredMedia];
    
    // Remove the item at dragIndex
    newFilteredMedia.splice(dragIndex, 1);
    
    // Insert it at hoverIndex
    newFilteredMedia.splice(hoverIndex, 0, draggedItem);
    
    // Update each item's sort_order based on its new position
    const updatedFilteredMedia = newFilteredMedia.map((item, index) => ({
      ...item,
      sort_order: index + 1
    }));
    
    // Update the filteredMedia state
    setFilteredMedia(updatedFilteredMedia);
    
    // Also update the full media array to ensure consistency
    setMedia(prevMedia => {
      const mediaMap = new Map(prevMedia.map(item => [item.id, item]));
      
      // Update sort_order for each moved item
      updatedFilteredMedia.forEach(item => {
        if (mediaMap.has(item.id)) {
          const existingItem = mediaMap.get(item.id);
          mediaMap.set(item.id, { ...existingItem, sort_order: item.sort_order });
        }
      });
      
      // Convert map back to array and sort it
      return Array.from(mediaMap.values()).sort((a, b) => {
        // First sort by sort_order
        const orderA = a.sort_order ?? Number.MAX_VALUE;
        const orderB = b.sort_order ?? Number.MAX_VALUE;
        return orderA - orderB;
      });
    });
    
    // Mark that there are unsaved changes
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
        
        {!hasUnsavedChanges && lastOrderSave && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3">
            <p className="text-green-200 text-sm">
              Order saved successfully at {lastOrderSave}
            </p>
          </div>
        )}
        
        <div className="text-sm text-white/60 mb-2">
          {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'} found
          {categoryFilter && ` in category "${categoryFilter}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        
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
            onMove={moveItem}
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
