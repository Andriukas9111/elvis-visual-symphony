
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/api/useContent';

interface AboutStoryProps {
  isInView: boolean;
}

const AboutStory: React.FC<AboutStoryProps> = ({ isInView }) => {
  const { data: contentData } = useContent('about');
  const [storyContent, setStoryContent] = useState<string>('');

  // Default content if none is found in the database
  const defaultContent = `
    <p>
      Hi there! My name is Elvis and I'm a videographer based in the United Kingdom. I originally come from Lithuania, a small country located in the centre of Europe. I like to say that I was put on this earth to make videos and share my vision with others.
    </p>
    
    <p>
      I filmed and edited my first "project" when I was around 10 years old and from that moment I already knew what my career path will be. I never tried looking for anything else that I'd like to do and just stuck with filming and editing videos.
    </p>
    
    <p>
      I grew up in the times when social media was just becoming the thing so I closely watched how this space evolved into what it is now. I'm very familiar with the idea of social media and what type of content works for different niches, which makes me capable of narrowing down exactly what clients are looking for and help them to promote their content/product.
    </p>
  `;

  useEffect(() => {
    if (contentData) {
      const aboutContent = contentData.find(item => item.content);
      if (aboutContent?.content) {
        setStoryContent(aboutContent.content);
      } else {
        setStoryContent(defaultContent);
      }
    } else {
      setStoryContent(defaultContent);
    }
  }, [contentData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src="/lovable-uploads/4b1271b8-e1a8-494f-a510-e17f286adf45.png"
              alt="Elvis with camera" 
              className="w-full object-cover aspect-[4/5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-elvis-dark to-transparent opacity-70"></div>
            <div className="absolute bottom-4 left-4 flex items-center">
              <div className="h-2 w-2 bg-elvis-pink rounded-full animate-pulse mr-2"></div>
              <span className="text-white/90 text-sm font-medium">Videographer & Cinematographer</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="lg:col-span-7">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
          My Story
        </h3>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/80 space-y-4 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: storyContent }}
        />
      </div>
    </div>
  );
};

export default AboutStory;
