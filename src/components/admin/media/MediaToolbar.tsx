
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, GridIcon, ListIcon, Search, Save, Upload } from 'lucide-react';

interface MediaToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  availableCategories: string[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  setIsUploadModalOpen: (open: boolean) => void;
}

const MediaToolbar: React.FC<MediaToolbarProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  availableCategories,
  viewMode,
  onViewModeChange,
  hasUnsavedChanges,
  isSaving,
  onSave,
  setIsUploadModalOpen
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="flex flex-col md:flex-row gap-4 flex-grow">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-elvis-light border-white/10"
          />
        </div>
        
        <div className="md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
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
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? 'bg-elvis-pink hover:bg-elvis-pink-800' : ''}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onViewModeChange('list')}
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
            onClick={onSave}
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
        
        <Button 
          className="bg-elvis-pink hover:bg-elvis-pink-800 whitespace-nowrap"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>
    </div>
  );
};

export default MediaToolbar;
