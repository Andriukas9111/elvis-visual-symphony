
import React, { useEffect } from 'react';
import { useAboutContent } from '@/hooks/api/useAboutContent';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AboutStory = () => {
  const { aboutData, isLoading } = useAboutContent();
  const [ref, inView] = useInView({ 
    triggerOnce: true,
    threshold: 0.1
  });
  const controls = useAnimation();
  const imageControls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 });
      
      // Start the subtle parallax effect on the image
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const element = ref.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const viewportHeight = window.innerHeight;
          const distance = centerY - viewportHeight / 2;
          
          // Apply subtle parallax effect
          imageControls.start({ 
            y: distance * 0.05, 
            transition: { type: "spring", stiffness: 50, damping: 30 }
          });
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [inView, controls, imageControls, ref]);

  if (isLoading || !aboutData) return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-[400px] md:h-[500px] bg-gray-800 animate-pulse rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 w-32 bg-gray-700 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
          <div className="h-4 w-full bg-gray-700 animate-pulse rounded"></div>
          <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4" ref={ref}>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="relative"
          initial={{ x: -20, opacity: 0 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {aboutData.about_content?.profile_image && (
            <div className="relative rounded-lg overflow-hidden border-l-4 border-primary">
              <motion.img 
                src={aboutData.about_content.profile_image} 
                alt="Elvis Creative" 
                className="w-full object-cover h-[400px] md:h-[500px]"
                animate={imageControls}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {aboutData.about_content?.role && (
                <div className="absolute bottom-6 left-6 bg-elvis-darker/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <p className="text-primary font-medium text-sm">
                    {aboutData.about_content.role}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          initial={{ x: 20, opacity: 0 }}
          animate={controls}
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
