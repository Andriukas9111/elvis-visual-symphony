
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tables } from '@/types/supabase';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnimation } from '@/contexts/AnimationContext';

interface ProjectSliderProps {
  projects: Tables<'media'>[];
  currentVideoId: string | null;
  onVideoPlay: (id: string) => void;
}

const ProjectSlider: React.FC<ProjectSliderProps> = ({ 
  projects, 
  currentVideoId, 
  onVideoPlay 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { prefersReducedMotion } = useAnimation();
  
  const project = projects[currentIndex];
  
  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };
  
  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };
  
  const handlePlay = () => {
    if (project) {
      onVideoPlay(project.id);
    }
  };
  
  if (!project) return null;
  
  return (
    <div className="relative h-[60vh] max-h-[600px] rounded-xl overflow-hidden">
      {/* Featured Project Image */}
      <motion.div 
        className="w-full h-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={project.thumbnail_url || project.url} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </motion.div>
      
      {/* Project Details */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
            {project.description && (
              <p className="text-white/80 mb-4 max-w-2xl line-clamp-2">{project.description}</p>
            )}
            <Button 
              className="bg-primary hover:bg-primary/90 text-white" 
              onClick={handlePlay}
            >
              View Project
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Video Play Button Overlay */}
      {project.type === 'video' && (
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
            onClick={handlePlay}
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
  );
};

export default ProjectSlider;
