
import { useState } from 'react';
import { Tables } from '@/types/supabase';

export type MediaItem = Tables<'media'>;
export type ViewMode = 'grid' | 'featured' | 'list';
export type OrientationType = 'all' | 'horizontal' | 'vertical';
export type SortOption = 'newest' | 'oldest' | 'title' | 'random';

export const useMediaFilters = (initialMedia: MediaItem[] = []) => {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orientation, setOrientation] = useState<OrientationType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const updateMediaItems = (mediaItems: MediaItem[] | undefined) => {
    if (mediaItems) {
      setMedia(mediaItems);
      const uniqueCategories = ['All', ...new Set(mediaItems.map(item => item.category))].filter(Boolean);
      setCategories(uniqueCategories);
    }
  };
  
  // Filter media items
  const filteredMedia = media.filter(item => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    
    const orientationMatch = orientation === 'all' || 
      (orientation === 'horizontal' && item.orientation === 'horizontal') ||
      (orientation === 'vertical' && item.orientation === 'vertical');
    
    const searchMatch = !searchTerm || 
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && orientationMatch && searchMatch;
  });
  
  // Sort media items
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'oldest':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'random':
        return Math.random() - 0.5;
      default:
        return 0;
    }
  });
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleOrientationChange = (newOrientation: OrientationType) => {
    setOrientation(newOrientation);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };
  
  const handleResetFilters = () => {
    setActiveCategory('All');
    setOrientation('all');
    setSearchTerm('');
    setSortBy('newest');
  };
  
  return {
    media,
    filteredMedia: sortedMedia,
    categories,
    activeCategory,
    orientation,
    viewMode,
    searchTerm,
    sortBy,
    updateMediaItems,
    handleCategoryChange,
    handleOrientationChange,
    handleViewModeChange,
    handleSearch,
    handleSortChange,
    handleResetFilters
  };
};
