
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMedia } from '@/hooks/useSupabase';
import { useMediaFilters } from '@/hooks/useMediaFilters';
import SectionTitle from './featured/SectionTitle';
import FilterControls from './featured/FilterControls';
import MediaGrid from './featured/MediaGrid';

const FeaturedProjects = () => {
  const {
    media,
    filteredMedia,
    categories,
    activeCategory,
    orientation,
    viewMode,
    sortBy,
    updateMediaItems,
    handleCategoryChange,
    handleOrientationChange,
    handleViewModeChange,
    handleSortChange,
    handleResetFilters
  } = useMediaFilters();
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Use the useMedia hook to fetch featured media items
  const { data: mediaItems, isLoading: mediaLoading, error: mediaError } = useMedia({
    featured: true,
    limit: 8
  });
  
  useEffect(() => {
    if (mediaItems) {
      updateMediaItems(mediaItems);
      setIsLoading(false);
      console.log('Media items loaded:', mediaItems.length);
      console.log('Categories:', [...new Set(mediaItems.map(item => item.category))]);
    }
    
    if (mediaError) {
      console.error('Error fetching media:', mediaError);
      setError('Failed to load featured projects');
      toast.error('Failed to load featured projects');
      setIsLoading(false);
    }
  }, [mediaItems, mediaError, updateMediaItems]);
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  
  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  if (isLoading || mediaLoading) {
    return (
      <section className="py-24 bg-elvis-dark relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-elvis-pink/30 border-t-elvis-pink rounded-full animate-spin"></div>
            <p className="mt-4 text-white/70">Loading featured projects...</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-24 bg-elvis-dark relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-red-500 mb-4 text-5xl">!</div>
            <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
            <p className="text-white/70 mb-6">We couldn't load the featured projects. Please try again later.</p>
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
      id="featured-projects" 
      className="py-24 bg-elvis-dark relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-elvis-purple/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-elvis-pink/10 blur-[100px] rounded-full"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section title */}
          <SectionTitle />
          
          {/* Filters and controls */}
          <FilterControls 
            categories={categories}
            activeCategory={activeCategory}
            orientation={orientation}
            viewMode={viewMode}
            sortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onOrientationChange={handleOrientationChange}
            onViewModeChange={handleViewModeChange}
            onSortChange={handleSortChange}
          />
          
          {/* Media grid */}
          <MediaGrid 
            media={filteredMedia}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />
          
          {/* "View more" button */}
          <motion.div 
            className="text-center mt-12"
            variants={itemAnimation}
          >
            <Button asChild className="bg-elvis-gradient shadow-pink-glow">
              <Link to="/portfolio">
                Explore Full Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
