
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid3X3, Layout, Filter, Film, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPlayer from '../portfolio/VideoPlayer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMedia } from '@/lib/api';
import { Tables } from '@/types/supabase';

type MediaItem = Tables<'media'>;

// Portfolio categories - these will be populated from the database
const defaultCategories = ['All', 'Commercial', 'Nature', 'Entertainment', 'Cityscape', 'Events'];

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orientation, setOrientation] = useState<'all' | 'horizontal' | 'vertical'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const mediaItems = await getMedia({ featured: true, limit: 6 });
        setPortfolioItems(mediaItems || []);
        
        // Extract unique categories from the media items
        if (mediaItems && mediaItems.length > 0) {
          const uniqueCategories = ['All', ...new Set(mediaItems.map(item => item.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, []);
  
  const filteredItems = portfolioItems.filter(item => {
    // Filter by category
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    
    // Filter by orientation
    const orientationMatch = orientation === 'all' || 
      (orientation === 'horizontal' && item.orientation === 'horizontal') ||
      (orientation === 'vertical' && item.orientation === 'vertical');
    
    return categoryMatch && orientationMatch;
  });
  
  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="py-24 bg-elvis-dark relative overflow-hidden"
    >
      {/* Decorative elements */}
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
              Browse our collection of cinematic videos and photographs showcasing both vertical reels 
              and widescreen productions that highlight our creative vision
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* View mode toggles */}
            <div className="border border-elvis-pink/30 rounded-lg p-1 flex">
              <Button
                variant="ghost"
                size="icon"
                className={`p-1 ${viewMode === 'featured' ? 'bg-elvis-pink/20' : ''}`}
                onClick={() => setViewMode('featured')}
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`p-1 ${viewMode === 'grid' ? 'bg-elvis-pink/20' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
            
            <Button asChild variant="link" className="text-elvis-pink flex items-center group">
              <Link to="/portfolio">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Category filters */}
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
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Orientation filter */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 border-elvis-pink/50">
              <Filter className="w-3 h-3 mr-1" /> Format
            </Badge>
            <div className="flex bg-elvis-darker/50 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-1 text-xs ${orientation === 'all' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => setOrientation('all')}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'horizontal' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => setOrientation('horizontal')}
              >
                <Film className="w-3 h-3 mr-1" /> Horizontal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-3 py-1 text-xs flex items-center ${orientation === 'vertical' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => setOrientation('vertical')}
              >
                <Camera className="w-3 h-3 mr-1" /> Vertical
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-elvis-pink/30 border-t-elvis-pink rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Portfolio grid */}
            <motion.div
              key={`${viewMode}-${orientation}-${activeCategory}`}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                viewMode === 'featured' ? 'md:grid-rows-2 md:grid-cols-3' : ''
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`${
                      viewMode === 'featured' && index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    } ${item.orientation === 'vertical' ? 'aspect-[9/16]' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <VideoPlayer 
                      videoUrl={item.video_url || ''} 
                      thumbnail={item.thumbnail_url || item.url} 
                      title={item.title}
                      isVertical={item.orientation === 'vertical'}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-white/60">No projects match your current filters.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveCategory('All');
                      setOrientation('all');
                    }}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
        
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

export default Portfolio;
