
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMedia } from '@/hooks/api/useMedia';
import FilterControls from './featured/FilterControls';
import MediaGrid from './featured/MediaGrid';
import ProjectSlider from './featured/ProjectSlider';
import { Loader2 } from 'lucide-react';

const FeaturedProjects = () => {
  const [orientation, setOrientation] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('slider');

  // Fetch featured media from Supabase
  const { data: media, isLoading } = useMedia({
    featured: true,
  });

  // For debugging
  useEffect(() => {
    if (media && media.length > 0) {
      console.log("Featured media loaded:", media.length, "items");
    }
  }, [media]);

  // Filter media based on selected orientation
  const filteredMedia = orientation 
    ? media?.filter(item => item.orientation === orientation) 
    : media;

  // Handle video play to ensure only one video plays at a time
  const handleVideoPlay = (id: string) => {
    console.log("Setting current video ID to:", id);
    setCurrentVideoId(id);
  };

  // Get featured videos for the slider
  const featuredVideos = media?.filter(item => 
    item.is_featured && item.type === 'video'
  ) || [];

  return (
    <section className="py-24 bg-elvis-darker relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Featured Projects</h2>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Check out some of my best work. Filter by orientation to find exactly what you're looking for.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-elvis-pink animate-spin" />
          </div>
        ) : featuredVideos.length > 0 ? (
          <>
            {/* Project Slider for featured videos */}
            <div className="mb-16">
              <ProjectSlider 
                projects={featuredVideos}
                currentVideoId={currentVideoId}
                onVideoPlay={handleVideoPlay}
              />
            </div>
            
            {/* View mode and filter controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <button 
                  onClick={() => setViewMode('slider')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    viewMode === 'slider' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Featured
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  All Projects
                </button>
              </div>
              
              <FilterControls 
                orientation={orientation} 
                setOrientation={setOrientation}
              />
            </div>
            
            {/* Show grid view if selected */}
            {viewMode === 'grid' && filteredMedia && filteredMedia.length > 0 && (
              <MediaGrid 
                media={filteredMedia} 
                currentVideoId={currentVideoId}
                onVideoPlay={handleVideoPlay}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-white text-xl">No projects found with the selected filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
