
import { useState, useEffect } from 'react';

export const useMediaFilters = (media: any[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);

  // Apply filters to the media array
  const applyFilters = (query: string, category: string) => {
    let filtered = [...media];
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm)) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.category && item.category.toLowerCase().includes(searchTerm)) ||
        (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)))
      );
    }
    
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    setFilteredMedia(filtered);
    return filtered;
  };

  // Apply filters automatically when media, searchQuery or categoryFilter changes
  useEffect(() => {
    applyFilters(searchQuery, categoryFilter);
  }, [media, searchQuery, categoryFilter]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    viewMode,
    setViewMode,
    filteredMedia,
    applyFilters
  };
};
