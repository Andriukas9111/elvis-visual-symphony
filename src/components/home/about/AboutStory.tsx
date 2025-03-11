
import React from 'react';
import { useAboutContent } from '@/hooks/api/useAboutContent';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AboutStory = () => {
  const { aboutData, isLoading } = useAboutContent();
  const [ref, inView] = useInView({ 
    triggerOnce: true,
    threshold: 0.1
  });

  if (isLoading || !aboutData) return null;

  return (
    <div className="container mx-auto px-4" ref={ref}>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="relative"
          initial={{ x: -20 }}
          animate={inView ? { x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {aboutData.about_content?.profile_image && (
            <div className="relative rounded-lg overflow-hidden border-l-4 border-primary">
              <img 
                src={aboutData.about_content.profile_image} 
                alt="Elvis Creative" 
                className="w-full object-cover h-[400px] md:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          initial={{ x: 20 }}
          animate={inView ? { x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">My Story</h2>
          {aboutData.about_content?.story && (
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">{aboutData.about_content.story}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutStory;
