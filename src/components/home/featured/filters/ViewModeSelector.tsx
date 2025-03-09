
import React from 'react';
import { Sparkles, Grid3X3, GalleryVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ViewMode } from '@/hooks/useMediaFilters';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeSelector = ({
  viewMode,
  onViewModeChange,
}: ViewModeSelectorProps) => {
  return (
    <TooltipProvider>
      <div className="border border-elvis-pink/30 rounded-full p-1 flex bg-elvis-darker/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`p-1 rounded-full ${viewMode === 'featured' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
              onClick={() => onViewModeChange('featured')}
              aria-label="Featured view"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Featured View</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`p-1 rounded-full ${viewMode === 'grid' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Grid View</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`p-1 rounded-full ${viewMode === 'list' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
            >
              <GalleryVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>List View</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ViewModeSelector;
