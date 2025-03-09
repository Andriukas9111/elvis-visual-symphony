import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Film, 
  Camera, 
  Grid3X3, 
  LayoutGrid, 
  Sparkles,
  SlidersHorizontal,
  GalleryVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMedia } from '@/lib/api';
import { Tables } from '@/types/supabase';
import { toast } from 'sonner';
import VideoCard from '../portfolio/VideoCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MediaItem = Tables<'media'>;
type ViewMode = 'grid' | 'featured' | 'list';
type OrientationType = 'all' | 'horizontal' | 'vertical';

const FeaturedProjects = () => {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orientation, setOrientation] = useState<OrientationType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const mediaItems = await getMedia({ 
          featured: true, 
          limit: 8
        });
        
        if (!mediaItems || mediaItems.length === 0) {
          setError('No featured videos found');
        } else {
          setVideos(mediaItems);
          
          const uniqueCategories = ['All', ...new Set(mediaItems.map(item => item.category))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
        toast.error('Failed to load featured projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  if (isLoading) {
    return (
      <section className="py-24 bg-elvis-dark relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-elvis-pink/30 border-t-elvis-pink rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-24 bg-elvis-dark relative">
        <div className="container mx-auto px-4">
          <div className="text-center py-32">
            <h3 className="text-2xl font-bold text-white mb-4">Oops!</h3>
            <p className="text-white/70 mb-6">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section 
      ref={sectionRef}
      id="featured-projects" 
      className="py-24 bg-elvis-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-elvis-purple/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-elvis-pink/10 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gradient">Featured</span> Projects
            </motion.h2>
            
            <motion.p 
              className="text-white/70 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Browse my collection of cinematic storytelling — from immersive vertical stories 
              to widescreen productions that capture the essence of each project.
            </motion.p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0">
            <TooltipProvider>
              <div className="border border-elvis-pink/30 rounded-full p-1 flex bg-elvis-darker/50">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`p-1 rounded-full ${viewMode === 'featured' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                      onClick={() => handleViewModeChange('featured')}
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
                      onClick={() => handleViewModeChange('grid')}
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
                      onClick={() => handleViewModeChange('list')}
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
            
            <Button asChild variant="link" className="text-elvis-pink flex items-center group">
              <Link to="/portfolio">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    activeCategory === category 
                      ? 'bg-elvis-pink text-white shadow-pink-glow' 
                      : 'bg-elvis-darker/50 text-white/70 hover:bg-elvis-pink/20'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 border-elvis-pink/50 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Format
            </Badge>
            <div className="flex bg-elvis-darker/50 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-1 text-xs ${orientation === 'all' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => handleOrientationChange('all')}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'horizontal' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => handleOrientationChange('horizontal')}
              >
                <Film className="w-3 h-3 mr-1" /> Widescreen
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'vertical' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => handleOrientationChange('vertical')}
              >
                <Camera className="w-3 h-3 mr-1" /> Vertical
              </Button>
            </div>
          </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${orientation}-${activeCategory}`}
            className={`grid gap-6 
              ${viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : viewMode === 'featured' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'}`
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className={`${
                    viewMode === 'featured' && index === 0 
                      ? 'col-span-1 md:col-span-2 row-span-2' 
                      : ''
                  }`}
                  variants={itemVariants}
                >
                  <VideoCard
                    video={video}
                    isVertical={video.orientation === 'vertical'}
                    isFeatured={viewMode === 'featured' && index === 0}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-16"
                variants={itemVariants}
              >
                <p className="text-white/60 mb-4">No videos match your current filters.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveCategory('All');
                    setOrientation('all');
                  }}
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button asChild className="bg-elvis-gradient shadow-pink-glow">
            <Link to="/portfolio">
              Explore Full Portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
