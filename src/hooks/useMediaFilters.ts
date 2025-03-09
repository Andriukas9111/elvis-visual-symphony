
import { useState, useEffect } from 'react';
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
      // Extract unique categories from media items
      const uniqueCategories = ['All', ...new Set(mediaItems.map(item => item.category))].filter(Boolean) as string[];
      setCategories(uniqueCategories);
    }
  };
  
  // Use useEffect to ensure categories are updated when media changes
  useEffect(() => {
    if (media.length > 0) {
      const uniqueCategories = ['All', ...new Set(media.map(item => item.category))].filter(Boolean) as string[];
      setCategories(uniqueCategories);
    }
  }, [media]);
  
  // Filter media items based on active filters
  const filteredMedia = media.filter(item => {
    // Category filtering
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    
    // Orientation filtering
    const orientationMatch = orientation === 'all' || 
      (orientation === 'horizontal' && item.orientation === 'horizontal') ||
      (orientation === 'vertical' && item.orientation === 'vertical');
    
    // Search filtering
    const searchMatch = !searchTerm || 
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && orientationMatch && searchMatch;
  });
  
  // Sort filtered media
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
    console.log('Category changed to:', category);
    setActiveCategory(category);
  };

  const handleOrientationChange = (newOrientation: OrientationType) => {
    console.log('Orientation changed to:', newOrientation);
    setOrientation(newOrientation);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    console.log('View mode changed to:', mode);
    setViewMode(mode);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleSortChange = (sort: SortOption) => {
    console.log('Sort changed to:', sort);
    setSortBy(sort);
  };
  
  const handleResetFilters = () => {
    console.log('Resetting all filters');
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
