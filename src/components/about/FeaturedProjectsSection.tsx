
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface FeaturedProject {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  video_url?: string;
  is_featured: boolean;
  order_index: number;
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
  
  const handlePrev = () => {
    if (!projects || projects.length === 0) return;
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    if (!projects || projects.length === 0) return;
    setCurrentIndex(prevIndex => 
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-8">
        <SectionHeading title="Featured Projects" />
        
        <div className="flex space-x-2">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full border border-gray-700 hover:border-elvis-pink hover:bg-elvis-pink/10 transition-colors"
            aria-label="Previous project"
            disabled={isLoading}
          >
            <ChevronLeft className="text-white w-5 h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 rounded-full border border-gray-700 hover:border-elvis-pink hover:bg-elvis-pink/10 transition-colors"
            aria-label="Next project"
            disabled={isLoading}
          >
            <ChevronRight className="text-white w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-[500px] rounded-lg bg-elvis-medium animate-pulse" />
      ) : projects && projects.length > 0 ? (
        <div className="relative h-[500px] overflow-hidden rounded-lg">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentIndex ? 1 : 0,
                zIndex: index === currentIndex ? 10 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-full w-full">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                  {project.description && (
                    <p className="text-white/80 mb-4 max-w-2xl">{project.description}</p>
                  )}
                  {project.video_url && (
                    <Button 
                      variant="outline" 
                      className="border-elvis-pink text-white hover:bg-elvis-pink/20 w-fit"
                    >
                      View Project
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="h-[500px] flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">No featured projects found</p>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <Link 
          to="/portfolio"
          className="text-elvis-pink hover:text-elvis-pink/80 font-medium flex items-center"
        >
          View All Projects
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
