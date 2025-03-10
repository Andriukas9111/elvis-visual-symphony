
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMedia } from '@/hooks/useMedia';

interface ProjectsShowcaseProps {
  isInView: boolean;
}

const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ isInView }) => {
  const { data: mediaItems, isLoading } = useMedia();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get featured projects - limit to 5 for showcase
  const featuredProjects = React.useMemo(() => {
    if (!mediaItems) return [];
    
    return mediaItems
      .filter(item => item.is_featured)
      .slice(0, 5);
  }, [mediaItems]);

  const handleNext = () => {
    if (isTransitioning || !featuredProjects.length) return;
    
    setIsTransitioning(true);
    setActiveIndex((current) => 
      current === featuredProjects.length - 1 ? 0 : current + 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isTransitioning || !featuredProjects.length) return;
    
    setIsTransitioning(true);
    setActiveIndex((current) => 
      current === 0 ? featuredProjects.length - 1 : current - 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="w-full glass-card p-6 rounded-xl border border-white/10 animate-pulse">
        <div className="flex items-center mb-6">
          <div className="h-8 w-2 bg-white/20 rounded-full mr-3"></div>
          <div className="h-8 w-48 bg-white/20 rounded"></div>
        </div>
        <div className="h-80 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  // If no featured projects, show empty state
  if (featuredProjects.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-8">
          <span className="h-8 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        </div>
        
        <div className="glass-card p-12 rounded-xl border border-white/10 text-center">
          <p className="text-white/60">No featured projects found. Mark some media items as featured in the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="h-8 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrev}
            disabled={isTransitioning}
            className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNext}
            disabled={isTransitioning}
            className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="relative overflow-hidden rounded-xl glass-card border border-white/10 hover:border-elvis-pink/20 transition-all">
        <div className="aspect-video relative">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                x: `${(index - activeIndex) * 100}%`,
                opacity: index === activeIndex ? 1 : 0.7,
                scale: index === activeIndex ? 1 : 0.95
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={project.thumbnail_url || '/placeholder.svg'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-white/80 mb-4 line-clamp-2">{project.description}</p>
                  
                  <Button 
                    variant="outline" 
                    className="bg-elvis-dark/50 border-elvis-pink/40 text-white hover:bg-elvis-pink/20 gap-2"
                    asChild
                  >
                    <a href={`/portfolio?id=${project.id}`}>
                      <span>View Project</span>
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Project indicator dots */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeIndex ? 'bg-elvis-pink' : 'bg-white/30'
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="link" 
          className="text-elvis-pink gap-2"
          asChild
        >
          <a href="/portfolio">
            <span>View All Projects</span>
            <ArrowRight size={16} />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
