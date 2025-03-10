
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Filter, Square, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMedia } from '@/lib/api';
import { Tables } from '@/types/supabase';
import VideoPlayer from '@/components/portfolio/VideoPlayer';
import { useIsMobile } from '@/hooks/use-mobile';

// Define animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Portfolio = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State for media items and filters
  const [mediaItems, setMediaItems] = useState<Tables<'media'>[]>([]);
  const [filteredItems, setFilteredItems] = useState<Tables<'media'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeOrientation, setActiveOrientation] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  
  // Fetch media items on mount
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching media items...');
        
        const mediaData = await getMedia();
        console.log('Fetched media items:', mediaData);
        
        if (mediaData && mediaData.length > 0) {
          // Sort by sort_order first, then by other criteria
          const sortedMedia = [...mediaData].sort((a, b) => {
            // First by sort_order (lower number comes first)
            if (a.sort_order !== b.sort_order) {
              return (a.sort_order || 9999) - (b.sort_order || 9999);
            }
            
            // Then by featured status
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            
            // Then by date (newest first)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          
          setMediaItems(sortedMedia);
          setFilteredItems(sortedMedia);
          
          // Extract unique categories
          const uniqueCategories = ['All', ...new Set(sortedMedia.map(item => item.category).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          console.log('No media items found or empty array returned');
          toast({
            title: "No portfolio items found",
            description: "Please check back later for updates to our portfolio",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching media:', error);
        toast({
          title: "Failed to load portfolio",
          description: "There was an error loading the portfolio items",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, [toast]);
  
  // Filter items when category or orientation changes
  useEffect(() => {
    if (!mediaItems.length) return;
    
    let filtered = [...mediaItems];
    
    // Apply category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Apply orientation filter
    if (activeOrientation) {
      filtered = filtered.filter(item => item.orientation === activeOrientation);
    }
    
    setFilteredItems(filtered);
  }, [activeCategory, activeOrientation, mediaItems]);
  
  // Helper function to check if item is a video
  const isVideo = (item: Tables<'media'>) => {
    return item.type === 'video' || Boolean(item.video_url);
  };
  
  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="/lovable-uploads/f16c3611-113c-4306-9e59-5e0d3a6d3200.png"
          alt="Video Editing Timeline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-elvis-dark/50 to-elvis-dark z-10" />
        
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My <span className="text-elvis-pink">Portfolio</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore my visual stories and creative projects that showcase my passion for videography
          </motion.p>
        </div>
      </section>
      
      {/* Category and Orientation Filters */}
      <section className="py-6 px-4 bg-elvis-medium/50 border-t border-b border-elvis-pink/20">
        <div className="container mx-auto">
          <div className="flex flex-col space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className={`
                    rounded-full px-4 py-1
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
            </div>
            
            {/* Orientation Filter */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <Button
                variant={activeOrientation === null ? "default" : "outline"}
                size="sm"
                className={`
                  rounded-full px-4 py-1
                  ${activeOrientation === null ? 
                    'bg-elvis-gradient shadow-pink-glow' : 
                    'border-elvis-pink/30 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                  }
                `}
                onClick={() => setActiveOrientation(null)}
              >
                <Filter className="w-4 h-4 mr-2" />
                All Orientations
              </Button>
              
              <Button
                variant={activeOrientation === 'horizontal' ? "default" : "outline"}
                size="sm"
                className={`
                  rounded-full px-4 py-1
                  ${activeOrientation === 'horizontal' ? 
                    'bg-elvis-gradient shadow-pink-glow' : 
                    'border-elvis-pink/30 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                  }
                `}
                onClick={() => setActiveOrientation('horizontal')}
              >
                <Layout className="w-4 h-4 mr-2" />
                Horizontal
              </Button>
              
              <Button
                variant={activeOrientation === 'vertical' ? "default" : "outline"}
                size="sm"
                className={`
                  rounded-full px-4 py-1
                  ${activeOrientation === 'vertical' ? 
                    'bg-elvis-gradient shadow-pink-glow' : 
                    'border-elvis-pink/30 text-white hover:bg-elvis-pink/10 hover:border-elvis-pink'
                  }
                `}
                onClick={() => setActiveOrientation('vertical')}
              >
                <Square className="w-4 h-4 mr-2 rotate-12" />
                Vertical
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Portfolio Grid */}
      <section className="py-12 px-4 bg-elvis-dark">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-elvis-pink animate-spin mb-4" />
              <p className="text-white/70">Loading portfolio items...</p>
            </div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="relative overflow-hidden rounded-xl bg-elvis-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={itemFadeIn}
                    >
                      <div className={`${item.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} relative`}>
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
                          </div>
                        )}
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
                            <span className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300 border border-elvis-pink/20">
                              {item.orientation}
                            </span>
                          )}
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
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
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-white/30 mb-4">
                    <Filter className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No results found</h3>
                    <p className="text-white/50 max-w-md mx-auto">
                      We couldn't find any items with the selected filters. Try adjusting your category or orientation filters.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveCategory('All');
                      setActiveOrientation(null);
                    }}
                    className="mt-4 border-elvis-pink/50 hover:bg-elvis-pink/10 hover:border-elvis-pink"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
