
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Filter, Grid3X3, Layout, Loader2 } from 'lucide-react';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { getMedia } from '@/lib/api';
import { Tables } from '@/types/supabase';

type MediaItem = Tables<'media'>;

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orientation, setOrientation] = useState<'all' | 'horizontal' | 'vertical'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const mediaItems = await getMedia();
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
        
        // Scroll to top when page loads
        window.scrollTo(0, 0);
        
        // Set loaded state for animations
        setTimeout(() => {
          setIsLoaded(true);
        }, 100);
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

  const handleVideoPlay = (id: string) => {
    console.log('Setting current video ID:', id);
    setCurrentVideoId(id);
  };

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      {/* Hero section */}
      <div className="pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-elvis-medium">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tighter"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-gradient">Portfolio</span>
          </motion.h1>
          
          <motion.p 
            className="text-white/70 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our collection of visual stories and creative projects that showcase our passion for photography and videography.
          </motion.p>
          
          {/* View mode toggle */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="border border-elvis-pink/30 rounded-lg p-1 flex">
              <Button
                variant="ghost"
                size="icon"
                className={`p-2 ${viewMode === 'masonry' ? 'bg-elvis-pink/20' : ''}`}
                onClick={() => setViewMode('masonry')}
              >
                <Layout className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`p-2 ${viewMode === 'grid' ? 'bg-elvis-pink/20' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
          {/* Category filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`
                  rounded-full px-6
                  ${activeCategory === category ? 
                    'bg-elvis-gradient shadow-pink-glow' : 
                    'border-elvis-pink/50 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                  }
                `}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </motion.div>
          
          {/* Orientation filter */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex bg-elvis-darker/50 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 py-1 ${orientation === 'all' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => setOrientation('all')}
              >
                All Formats
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 py-1 ${orientation === 'horizontal' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => setOrientation('horizontal')}
              >
                Horizontal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 py-1 ${orientation === 'vertical' ? 'bg-elvis-pink text-white' : 'text-white/70'}`}
                onClick={() => setOrientation('vertical')}
              >
                Vertical
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Portfolio grid */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-elvis-dark">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-elvis-pink animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${orientation}-${activeCategory}`}
                className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto'
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
                      className="portfolio-item rounded-xl overflow-hidden shadow-lg bg-elvis-medium hover:shadow-pink-glow transition-all duration-300"
                      style={{ 
                        opacity: 0,
                        transform: 'translateY(20px)',
                        animation: isLoaded ? `fade-in 0.5s ease-out ${index * 0.1}s forwards` : 'none'
                      }}
                    >
                      <div className={`${item.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} relative overflow-hidden`}>
                        <VideoPlayer 
                          videoUrl={item.video_url || ''} 
                          thumbnail={item.thumbnail_url || item.url} 
                          title={item.title}
                          isVertical={item.orientation === 'vertical'}
                          onPlay={() => handleVideoPlay(item.id)}
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block bg-elvis-pink/20 text-xs px-2 py-1 rounded-full text-elvis-pink border border-elvis-pink/30">
                            {item.category}
                          </span>
                          {item.orientation && (
                            <span className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-white/70">
                              {item.orientation === 'vertical' ? 'Vertical' : 'Horizontal'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        {item.description && (
                          <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.description}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300 border border-elvis-pink/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
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
                      className="mt-4 border-elvis-pink/50 hover:bg-elvis-pink/10 hover:border-elvis-pink"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
