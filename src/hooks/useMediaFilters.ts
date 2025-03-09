
import { useState } from 'react';
import { Tables } from '@/types/supabase';

export type MediaItem = Tables<'media'>;
export type ViewMode = 'grid' | 'featured' | 'list';
export type OrientationType = 'all' | 'horizontal' | 'vertical';

export const useMediaFilters = (initialMedia: MediaItem[] = []) => {
  const [videos, setVideos] = useState<MediaItem[]>(initialMedia);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orientation, setOrientation] = useState<OrientationType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('featured');
  
  const updateMediaItems = (mediaItems: MediaItem[] | undefined) => {
    if (mediaItems) {
      setVideos(mediaItems);
      const uniqueCategories = ['All', ...new Set(mediaItems.map(item => item.category))];
      setCategories(uniqueCategories);
    }
  };
  
  const filteredVideos = videos.filter(video => {
    const categoryMatch = activeCategory === 'All' || video.category === activeCategory;
    
    const orientationMatch = orientation === 'all' || 
      (orientation === 'horizontal' && video.orientation === 'horizontal') ||
      (orientation === 'vertical' && video.orientation === 'vertical');
    
    return categoryMatch && orientationMatch;
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
  
  return {
    videos,
    filteredVideos,
    categories,
    activeCategory,
    orientation,
    viewMode,
    updateMediaItems,
    handleCategoryChange,
    handleOrientationChange,
    handleViewModeChange
  };
};
