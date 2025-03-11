
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface FeaturedProject {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  video_url?: string;
  order_index: number;
  is_featured: boolean;
}

const FeaturedProjectsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['featuredProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_projects')
        .select('*')
        .eq('is_featured', true)
        .order('order_index');
        
      if (error) throw error;
      return data as FeaturedProject[];
    }
  });
  
  // Fallback projects if none are available
  const fallbackProjects = [
    {
      id: '1',
      title: 'Presets REEL',
      description: 'A showcase of my cinematic presets in action',
      image_url: '/lovable-uploads/481c31e4-1654-4b2b-9e86-08cff481f24a.png',
      video_url: 'https://www.youtube.com/watch?v=example',
      order_index: 1,
      is_featured: true
    }
  ];
  
  const displayProjects = projects?.length ? projects : fallbackProjects;
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayProjects.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayProjects.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  if (isLoading) {
    return (
      <section className="py-12 bg-elvis-dark">
        <div className="container mx-auto px-4">
          <SectionHeading title="Featured Projects" />
          <div className="max-w-7xl mx-auto">
            <div className="w-full h-[500px] rounded-xl bg-elvis-medium animate-pulse" />
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-elvis-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <SectionHeading title="Featured Projects" />
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevious}
              className="w-8 h-8 rounded-full border border-elvis-light flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button 
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-elvis-light flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 relative">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative overflow-hidden rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentIndex ? 1 : 0,
                display: index === currentIndex ? 'block' : 'none'
              }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full aspect-[2/1] object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 p-10 flex flex-col justify-end">
                <h3 className="text-white text-3xl font-bold">{project.title}</h3>
                {project.description && (
                  <p className="text-white/80 mt-2 max-w-2xl">{project.description}</p>
                )}
                
                {project.video_url && (
                  <a 
                    href={project.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-md w-fit"
                  >
                    <span>View Project</span>
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                )}
              </div>
              
              <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-elvis-pink"></div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-end mt-4">
          <a href="/portfolio" className="text-elvis-pink flex items-center text-sm hover:text-elvis-pink/80 transition-colors">
            <span>View All Projects</span>
            <ChevronRight className="ml-1 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
