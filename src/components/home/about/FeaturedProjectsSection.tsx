
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFeaturedProjects } from '@/hooks/api/useFeaturedProjects';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useAnimation } from '@/contexts/AnimationContext';

const FeaturedProjectsSection = () => {
  const { data: projects, isLoading } = useFeaturedProjects();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const { prefersReducedMotion } = useAnimation();
  
  const nextProject = () => {
    if (projects && projects.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }
  };
  
  const prevProject = () => {
    if (projects && projects.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };
  
  const handleViewProject = () => {
    if (projects && projects[currentIndex]) {
      const project = projects[currentIndex];
      if (project.type === 'video' && project.video_url) {
        setCurrentVideoId(project.id);
      } else {
        window.open(project.url, '_blank');
      }
    }
  };
  
  if (isLoading || !projects || projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 animate-pulse bg-gray-700 h-10 w-64 mx-auto rounded"></h2>
          <div className="h-4 w-96 mx-auto bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="h-[400px] bg-gray-800 animate-pulse rounded-xl"></div>
      </div>
    );
  }
  
  const currentProject = projects[currentIndex];
  
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Projects</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Check out some of my best work that showcases my skills and creativity.
        </p>
      </motion.div>
      
      <div className="relative h-[500px] rounded-xl overflow-hidden">
        {/* Project Image/Thumbnail */}
        <motion.div 
          className="w-full h-full"
          key={currentProject.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={currentProject.thumbnail_url} 
            alt={currentProject.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </motion.div>
        
        {/* Project Details */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-10">
          <motion.div
            key={`details-${currentProject.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentProject.title}</h3>
            {currentProject.description && (
              <p className="text-white/80 mb-4 max-w-2xl line-clamp-2">{currentProject.description}</p>
            )}
            <Button 
              className="bg-primary hover:bg-primary/90 text-white" 
              onClick={handleViewProject}
            >
              View Project
            </Button>
          </motion.div>
        </div>
        
        {/* Video Play Button Overlay */}
        {currentProject.type === 'video' && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewProject}
            >
              <Play className="w-8 h-8 text-white" fill="white" />
            </motion.button>
          </motion.div>
        )}
        
        {/* Navigation Arrows */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-20 hover:bg-black/80 transition-colors"
          onClick={prevProject}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-20 hover:bg-black/80 transition-colors"
          onClick={nextProject}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        
        {/* Indicator Dots */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-primary' : 'bg-white/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjectsSection;
