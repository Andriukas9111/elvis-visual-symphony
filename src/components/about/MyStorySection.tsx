
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  profile_image: string;
  job_title: string;
  story: string;
}

const MyStorySection: React.FC = () => {
  const { data: content, isLoading } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single();
        
      if (error) throw error;
      return data as AboutContent;
    }
  });
  
  if (isLoading) {
    return (
      <section className="py-16">
        <SectionHeading title="My Story" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-80 rounded-lg bg-elvis-medium animate-pulse" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 w-3/4 bg-elvis-medium animate-pulse rounded" />
            <div className="h-6 w-full bg-elvis-medium animate-pulse rounded" />
            <div className="h-6 w-full bg-elvis-medium animate-pulse rounded" />
            <div className="h-6 w-1/2 bg-elvis-medium animate-pulse rounded" />
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16">
      <SectionHeading title="My Story" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {content?.profile_image && (
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img 
                src={content.profile_image} 
                alt="Elvis Creative" 
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-elvis-pink text-white px-4 py-2 rounded-full">
                {content.job_title || "Videographer & Cinematographer"}
              </div>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="prose prose-lg prose-invert max-w-none">
            {content?.story ? (
              <div dangerouslySetInnerHTML={{ __html: content.story }} />
            ) : (
              <p>Story content unavailable.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MyStorySection;
