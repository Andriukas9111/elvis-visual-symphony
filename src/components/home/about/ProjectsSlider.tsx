
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMedia } from '@/hooks/useMedia';
import { ChevronLeft, ChevronRight, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectsSliderProps {
  isInView: boolean;
}

const ProjectsSlider: React.FC<ProjectsSliderProps> = ({ isInView }) => {
  const { data: mediaData, isLoading } = useMedia();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filter for featured projects
  const featuredProjects = mediaData?.filter(item => item.is_featured) || [];
  
  // Default project if none found
  const defaultProjects = [
    {
      id: '1',
      title: 'Presets REEL',
      description: 'A showcase of my color grading presets in action',
      url: '#',
      thumbnail_url: '/lovable-uploads/d2ec6a73-77bf-4854-a241-fa5b9fbd2385.png'
    }
  ];
  
  // Use projects from database or fallback to default
  const projects = featuredProjects.length > 0 ? featuredProjects : defaultProjects;
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };
  
  if (projects.length === 0) {
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center">
          <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
          Featured Projects
        </h3>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={prevSlide}
            className="border-white/10 hover:bg-elvis-pink/20 hover:border-elvis-pink/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={nextSlide}
            className="border-white/10 hover:bg-elvis-pink/20 hover:border-elvis-pink/50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl aspect-video"
      >
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h4 className="text-2xl font-bold text-white mb-2">{project.title}</h4>
              <a 
                href={project.url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-white/80 hover:text-elvis-pink transition-colors"
              >
                <span>View Project</span>
                <Link className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </motion.div>
      
      <div className="flex justify-end mt-3">
        <a 
          href="/portfolio" 
          className="text-elvis-pink hover:text-elvis-pink/80 text-sm flex items-center"
        >
          View All Projects →
        </a>
      </div>
    </div>
  );
};

export default ProjectsSlider;
