
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/use-mobile';
import { getMedia } from '@/lib/api';
import { Tables } from '@/types/supabase';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { 
  Play, Search, X, Grid3X3, Layout, Filter, 
  ChevronLeft, ChevronRight, LayoutGrid, Maximize2, 
  Minimize2, Share2, ArrowLeft, ArrowRight, Loader2,
  Image as ImageIcon, Film
} from 'lucide-react';

// Define types
type MediaItem = Tables<'media'>;
type ViewMode = 'grid' | 'masonry' | 'fullscreen';
type FilterMode = 'all' | 'category' | 'orientation' | 'tag';
type OrientationType = 'all' | 'horizontal' | 'vertical';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Portfolio = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const controls = useAnimation();
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // State for media items and loading
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // State for UI modes and filters
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [previousViewMode, setPreviousViewMode] = useState<ViewMode>('masonry');
  const [currentFilterMode, setCurrentFilterMode] = useState<FilterMode>('all');
  const [orientation, setOrientation] = useState<OrientationType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [tags, setTags] = useState<string[]>(['All']);
  
  // State for fullscreen and viewer mode
  const [fullscreenItem, setFullscreenItem] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  
  // Get URL params for potential deep linking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const itemIdParam = params.get('id');
    
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    
    // If itemId is provided, we'll need to open that item in fullscreen
    if (itemIdParam) {
      const item = mediaItems.find(item => item.id === itemIdParam);
      if (item) {
        openFullscreen(item);
      }
    }
  }, [location.search, mediaItems]);
  
  // Fetch media items on mount
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        controls.start('hidden');
        
        const mediaItems = await getMedia();
        console.log('Fetched media items:', mediaItems);
        
        setMediaItems(mediaItems || []);
        
        if (mediaItems && mediaItems.length > 0) {
          // Extract unique categories
          const uniqueCategories = ['All', ...new Set(mediaItems.map(item => item.category).filter(Boolean))];
          setCategories(uniqueCategories);
          
          // Extract unique tags (flatten the tags arrays from all items)
          const allTags = mediaItems.flatMap(item => item.tags || []);
          const uniqueTags = ['All', ...new Set(allTags)];
          setTags(uniqueTags);
        }
        
        // Simulate slight delay for smoother loading animation
        setTimeout(() => {
          setIsLoading(false);
          controls.start('visible');
        }, 300);
      } catch (error) {
        console.error('Error fetching media:', error);
        toast({
          title: "Failed to load portfolio items",
          description: "Please try again later",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, [controls, toast]);
  
  // Filter items whenever filters or search changes
  useEffect(() => {
    if (!mediaItems.length) return;
    
    setIsTransitioning(true);
    
    const filtered = mediaItems.filter(item => {
      // Category filter
      const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
      
      // Orientation filter
      const orientationMatch = orientation === 'all' || item.orientation === orientation;
      
      // Tag filter
      const tagMatch = activeTag === 'All' || (item.tags && item.tags.includes(activeTag));
      
      // Search filter (case insensitive)
      const searchMatch = !searchQuery || 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && orientationMatch && tagMatch && searchMatch;
    });
    
    // Set filtered items with a small delay for smoother transitions
    setTimeout(() => {
      setFilteredItems(filtered);
      setIsTransitioning(false);
    }, 300);
    
  }, [mediaItems, activeCategory, orientation, activeTag, searchQuery]);
  
  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    if (!fullscreenItem) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      } else if (e.key === 'ArrowRight') {
        navigateMedia('next');
      } else if (e.key === 'ArrowLeft') {
        navigateMedia('prev');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenItem, filteredItems, currentIndex]);
  
  // Handle entering and exiting fullscreen mode
  const openFullscreen = useCallback((item: MediaItem) => {
    setPreviousViewMode(viewMode);
    setViewMode('fullscreen');
    setFullscreenItem(item);
    
    // Find the index of the selected item
    const index = filteredItems.findIndex(mediaItem => mediaItem.id === item.id);
    setCurrentIndex(index !== -1 ? index : 0);
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    // Add this to URL for shareable links
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('id', item.id);
    window.history.pushState({}, '', newUrl);
  }, [viewMode, filteredItems]);
  
  const closeFullscreen = useCallback(() => {
    setViewMode(previousViewMode);
    setFullscreenItem(null);
    document.body.style.overflow = '';
    
    // Remove the id param from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('id');
    window.history.pushState({}, '', newUrl);
  }, [previousViewMode]);
  
  // Navigation within fullscreen mode
  const navigateMedia = (direction: 'next' | 'prev') => {
    let newIndex = currentIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    
    setCurrentIndex(newIndex);
    setFullscreenItem(filteredItems[newIndex]);
    
    // Update URL for shareable links
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('id', filteredItems[newIndex].id);
    window.history.pushState({}, '', newUrl);
  };
  
  // Sharing functionality
  const shareMedia = () => {
    if (!fullscreenItem) return;
    
    try {
      if (navigator.share) {
        navigator.share({
          title: fullscreenItem.title,
          text: fullscreenItem.description || 'Check out this amazing work',
          url: window.location.href
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        setShareOpen(true);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this link with others",
        });
        
        // Close share notification after 2 seconds
        setTimeout(() => {
          setShareOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  // Helper to determine if an item is a video
  const isVideo = (item: MediaItem) => {
    return item.type === 'video' || (item.video_url && item.video_url.length > 0);
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Toggle filtering modes
  const toggleFilter = (mode: FilterMode) => {
    setCurrentFilterMode(currentFilterMode === mode ? 'all' : mode);
  };
  
  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      {/* Hero section with parallax effect */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-elvis-darker flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-30 bg-[url('/placeholder.svg')] bg-center bg-cover bg-fixed" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-elvis-dark/20 to-elvis-dark/100" />
        <div className="relative z-10 container mx-auto text-center px-4">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My <span className="text-gradient">Portfolio</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore my visual stories and creative projects that showcase my passion for photography and videography
          </motion.p>
        </div>
        
        {/* Decorative aperture element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 md:w-24 md:h-24">
          <div className="camera-aperture w-full h-full aperture-breathe"></div>
        </div>
      </section>
      
      {/* Search and filter section */}
      <motion.section 
        className="py-8 px-4 bg-elvis-medium"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="container mx-auto">
          <div className="glass-card p-6 space-y-6">
            {/* Search bar */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-elvis-pink/70" />
                <Input 
                  type="text"
                  ref={searchInputRef}
                  placeholder="Search by title or description..."
                  className="pl-10 pr-10 py-6 bg-elvis-darker/70 border-elvis-pink/20 focus:border-elvis-pink text-white placeholder:text-white/50"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* View mode toggle */}
              <div className="flex items-center space-x-2 p-2 bg-elvis-darker/50 rounded-lg">
                <span className="text-white/70 text-sm hidden md:inline">View:</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`p-2 ${viewMode === 'grid' ? 'bg-elvis-pink/20' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`p-2 ${viewMode === 'masonry' ? 'bg-elvis-pink/20' : ''}`}
                  onClick={() => setViewMode('masonry')}
                  title="Masonry View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-elvis-pink/30 ${currentFilterMode === 'category' ? 'bg-elvis-pink text-white' : ''}`}
                  onClick={() => toggleFilter('category')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Categories
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-elvis-pink/30 ${currentFilterMode === 'orientation' ? 'bg-elvis-pink text-white' : ''}`}
                  onClick={() => toggleFilter('orientation')}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Orientation
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-elvis-pink/30 ${currentFilterMode === 'tag' ? 'bg-elvis-pink text-white' : ''}`}
                  onClick={() => toggleFilter('tag')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Tags
                </Button>
              </div>
            </div>
            
            {/* Category filters - shown when category mode is active */}
            <AnimatePresence>
              {currentFilterMode === 'category' && (
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      className={`
                        rounded-full px-4 py-1 text-sm
                        ${activeCategory === category ? 
                          'bg-elvis-gradient shadow-pink-glow' : 
                          'border-elvis-pink/30 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                        }
                      `}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </motion.div>
              )}
              
              {/* Orientation filters */}
              {currentFilterMode === 'orientation' && (
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant={orientation === 'all' ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${orientation === 'all' ? 'bg-elvis-gradient' : 'border-elvis-pink/30'}`}
                    onClick={() => setOrientation('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={orientation === 'horizontal' ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${orientation === 'horizontal' ? 'bg-elvis-gradient' : 'border-elvis-pink/30'}`}
                    onClick={() => setOrientation('horizontal')}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Horizontal
                  </Button>
                  <Button
                    variant={orientation === 'vertical' ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${orientation === 'vertical' ? 'bg-elvis-gradient' : 'border-elvis-pink/30'}`}
                    onClick={() => setOrientation('vertical')}
                  >
                    <Layout className="w-4 h-4 mr-2 rotate-90" />
                    Vertical
                  </Button>
                </motion.div>
              )}
              
              {/* Tag filters */}
              {currentFilterMode === 'tag' && (
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={activeTag === tag ? "default" : "outline"}
                      size="sm"
                      className={`
                        rounded-full px-4 py-1 text-sm
                        ${activeTag === tag ? 
                          'bg-elvis-gradient shadow-pink-glow' : 
                          'border-elvis-pink/30 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                        }
                      `}
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Results summary */}
          <div className="mt-4 px-2 flex justify-between items-center">
            <p className="text-white/70 text-sm">
              {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
            </p>
            
            {/* Active filters display */}
            <div className="flex flex-wrap gap-2 justify-end">
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center text-xs px-2 py-1 bg-elvis-pink/20 rounded-full text-elvis-pink border border-elvis-pink/30">
                  {activeCategory}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setActiveCategory('All')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              )}
              
              {orientation !== 'all' && (
                <span className="inline-flex items-center text-xs px-2 py-1 bg-elvis-pink/20 rounded-full text-elvis-pink border border-elvis-pink/30">
                  {orientation}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setOrientation('all')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              )}
              
              {activeTag !== 'All' && (
                <span className="inline-flex items-center text-xs px-2 py-1 bg-elvis-pink/20 rounded-full text-elvis-pink border border-elvis-pink/30">
                  {activeTag}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => setActiveTag('All')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              )}
              
              {searchQuery && (
                <span className="inline-flex items-center text-xs px-2 py-1 bg-elvis-pink/20 rounded-full text-elvis-pink border border-elvis-pink/30">
                  "{searchQuery}"
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0"
                    onClick={clearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Portfolio items grid */}
      <section className="py-12 px-4 bg-elvis-dark min-h-[50vh]">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-elvis-pink animate-spin mb-4" />
              <p className="text-white/70">Loading amazing content...</p>
            </div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <motion.div
                  className={`grid gap-6 
                    ${viewMode === 'grid' ? 
                      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 
                      'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6'
                    }`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate={controls}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`portfolio-item hover-card rounded-xl overflow-hidden bg-elvis-medium
                        ${viewMode === 'masonry' ? 'break-inside-avoid block mb-6' : ''}`}
                      variants={slideUp}
                      layoutId={`portfolio-${item.id}`}
                      onClick={() => openFullscreen(item)}
                    >
                      <div className={`${item.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} relative overflow-hidden`}>
                        {isVideo(item) ? (
                          <VideoPlayer 
                            videoUrl={item.video_url || ''}
                            thumbnail={item.thumbnail_url || item.url || ''}
                            title={item.title}
                            isVertical={item.orientation === 'vertical'}
                          />
                        ) : (
                          <div className="relative w-full h-full group">
                            <img 
                              src={item.url} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                console.error("Image load error:", item.url);
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <div className="p-4">
                                <Button variant="outline" size="sm" className="bg-elvis-darker/80 backdrop-blur-sm border-elvis-pink/30">
                                  <Maximize2 className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Media type indicator */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-elvis-darker/80 backdrop-blur-sm p-1 rounded-full">
                            {isVideo(item) ? (
                              <Film className="w-4 h-4 text-elvis-pink" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-elvis-pink" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-white/70 text-sm line-clamp-2 mb-3">{item.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.category && (
                            <span className="inline-block bg-elvis-pink/20 text-xs px-2 py-1 rounded-full text-elvis-pink border border-elvis-pink/30">
                              {item.category}
                            </span>
                          )}
                          
                          {item.orientation && (
                            <span className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-white/70">
                              {item.orientation === 'vertical' ? 'Vertical' : 'Horizontal'}
                            </span>
                          )}
                        </div>
                        
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300 border border-elvis-pink/20"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-white/30 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No results found</h3>
                    <p className="text-white/50 max-w-md mx-auto">
                      We couldn't find any items matching your current filters. Try adjusting your search or clearing some filters.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                      setOrientation('all');
                      setActiveTag('All');
                    }}
                    className="mt-4 border-elvis-pink/50 hover:bg-elvis-pink/10 hover:border-elvis-pink"
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Fullscreen viewer */}
      <AnimatePresence>
        {viewMode === 'fullscreen' && fullscreenItem && (
          <motion.div 
            ref={fullscreenRef}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fullscreen controls */}
            <div className="absolute top-4 right-4 z-60 flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-elvis-darker/80 backdrop-blur-md hover:bg-elvis-dark"
                onClick={shareMedia}
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-elvis-darker/80 backdrop-blur-md hover:bg-elvis-dark"
                onClick={closeFullscreen}
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
            
            {/* Navigation controls */}
            <div className="absolute inset-y-0 left-4 flex items-center z-50">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-elvis-darker/80 backdrop-blur-md hover:bg-elvis-dark"
                onClick={() => navigateMedia('prev')}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
            </div>
            
            <div className="absolute inset-y-0 right-4 flex items-center z-50">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-elvis-darker/80 backdrop-blur-md hover:bg-elvis-dark"
                onClick={() => navigateMedia('next')}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </div>
            
            {/* Media content */}
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
              <motion.div 
                className="w-full max-w-6xl h-full flex flex-col"
                layoutId={`portfolio-${fullscreenItem.id}`}
              >
                <div className="flex-grow flex items-center justify-center relative">
                  {isVideo(fullscreenItem) ? (
                    <div className={`w-full ${fullscreenItem.orientation === 'vertical' ? 'max-w-[40vh] mx-auto' : 'max-h-[80vh]'}`}>
                      <VideoPlayer 
                        videoUrl={fullscreenItem.video_url || ''}
                        thumbnail={fullscreenItem.thumbnail_url || fullscreenItem.url || ''}
                        title={fullscreenItem.title}
                        isVertical={fullscreenItem.orientation === 'vertical'}
                        hideOverlayText={true}
                      />
                    </div>
                  ) : (
                    <img 
                      src={fullscreenItem.url} 
                      alt={fullscreenItem.title}
                      className={`
                        object-contain max-h-[80vh] w-auto mx-auto
                        ${fullscreenItem.orientation === 'vertical' ? 'max-w-[40vh]' : 'max-w-full'}
                      `}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  )}
                </div>
                
                {/* Info panel */}
                <div className="bg-elvis-darker/90 backdrop-blur-sm mt-4 p-4 rounded-lg">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{fullscreenItem.title}</h2>
                  {fullscreenItem.description && (
                    <p className="text-white/70 mt-2">{fullscreenItem.description}</p>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {fullscreenItem.category && (
                      <span className="inline-block bg-elvis-pink/20 text-xs px-2 py-1 rounded-full text-elvis-pink border border-elvis-pink/30">
                        {fullscreenItem.category}
                      </span>
                    )}
                    
                    {fullscreenItem.tags && fullscreenItem.tags.length > 0 && (
                      fullscreenItem.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300 border border-elvis-pink/20"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                  
                  {/* Counter */}
                  <div className="mt-4 text-sm text-white/50">
                    {currentIndex + 1} of {filteredItems.length}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Share notification */}
            <AnimatePresence>
              {shareOpen && (
                <motion.div 
                  className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-elvis-purple text-white px-4 py-2 rounded-full shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  Link copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
      
      {/* Keyframe animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { 
              transform: scale(1);
              opacity: 0.5;
            }
            50% { 
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Portfolio;
