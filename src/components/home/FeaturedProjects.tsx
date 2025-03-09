
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMedia } from '@/hooks/useSupabase';
import { useMediaFilters } from '@/hooks/useMediaFilters';

// Import our newly created components
import FeaturedHeader from './featured/FeaturedHeader';
import CategoryFilter from './featured/CategoryFilter';
import ProjectsGrid from './featured/ProjectsGrid';
import { LoadingState, ErrorState } from './featured/StatusDisplay';

const FeaturedProjects = () => {
  const {
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
  } = useMediaFilters();
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Use the useMedia hook from useSupabase to fetch media items
  const { data: mediaItems, isLoading: mediaLoading, error: mediaError } = useMedia({
    featured: true,
    limit: 8
  });
  
  useEffect(() => {
    if (mediaItems) {
      updateMediaItems(mediaItems);
      setIsLoading(false);
    }
    
    if (mediaError) {
      console.error('Error fetching videos:', mediaError);
      setError('Failed to load videos');
      toast.error('Failed to load featured projects');
      setIsLoading(false);
    }
  }, [mediaItems, mediaError, updateMediaItems]);
  
  const handleResetFilters = () => {
    handleCategoryChange('All');
    handleOrientationChange('all');
  };
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  if (isLoading || mediaLoading) {
    return (
      <section className="py-24 bg-elvis-dark relative">
        <div className="container mx-auto px-4">
          <LoadingState isLoading={true} />
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-24 bg-elvis-dark relative">
        <div className="container mx-auto px-4">
          <ErrorState error={error} onRetry={handleRetry} />
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
        <FeaturedHeader 
          viewMode={viewMode} 
          onViewModeChange={handleViewModeChange}
          isInView={isInView}
        />
        
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          orientation={orientation}
          onCategoryChange={handleCategoryChange}
          onOrientationChange={handleOrientationChange}
          isInView={isInView}
        />
        
        <ProjectsGrid 
          filteredVideos={filteredVideos}
          viewMode={viewMode}
          activeCategory={activeCategory}
          orientation={orientation}
          onResetFilters={handleResetFilters}
        />
        
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
