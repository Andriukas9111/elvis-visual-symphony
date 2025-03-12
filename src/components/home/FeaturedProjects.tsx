
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMedia } from '@/hooks/api/useMedia'; // Correct import
import FilterControls from './featured/FilterControls';
import MediaGrid from './featured/MediaGrid';
import { Tables } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

const FeaturedProjects = () => {
  const [orientation, setOrientation] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Fetch featured media from Supabase
  const { data: media, isLoading } = useMedia({
    featured: true,
  });

  // For debugging
  useEffect(() => {
    if (media && media.length > 0) {
      console.log("Featured media loaded:", media.length, "items");
      const firstVideo = media.find(item => item.type === 'video');
      if (firstVideo) {
        console.log("First video item:", firstVideo);
        console.log("Video URLs available:", {
          video_url: firstVideo.video_url || 'none',
          file_url: firstVideo.file_url || 'none'
        });
      }
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

        <FilterControls 
          orientation={orientation} 
          setOrientation={setOrientation}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-elvis-pink animate-spin" />
          </div>
        ) : filteredMedia && filteredMedia.length > 0 ? (
          <MediaGrid 
            media={filteredMedia} 
            currentVideoId={currentVideoId}
            onVideoPlay={handleVideoPlay}
          />
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
