
import React from 'react';
import { motion } from 'framer-motion';

interface BioSectionProps {
  variants: {
    hidden: object;
    visible: object;
  };
  itemVariants: {
    hidden: object;
    visible: object;
  };
}

const BioSection = ({ variants, itemVariants }: BioSectionProps) => {
  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-2xl font-bold inline-flex items-center space-x-2"
        variants={itemVariants}
      >
        <span className="h-6 w-1 bg-elvis-pink rounded-full mr-2"></span>
        My Story
      </motion.h3>
      
      <motion.div 
        className="text-white/80 space-y-4 prose prose-invert max-w-none"
        variants={itemVariants}
      >
        <p>
          Hi there! My name is Elvis and I'm a videographer based in the United Kingdom. I originally come from Lithuania, a small country located in the centre of Europe. I like to say that I was put on this earth to make videos and share my vision with others.
        </p>
        
        <p>
          I filmed and edited my first "project" when I was around 10 years old and from that moment I already knew what my career path will be. I never tried looking for anything else that I'd like to do and just stuck with filming and editing videos.
        </p>
        
        <p>
          I grew up in the times when social media was just becoming the thing so I closely watched how this space evolved into what it is now. I'm very familiar with the idea of social media and what type of content works for different niches, which makes me capable of narrowing down exactly what clients are looking for and help them to promote their content/product.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BioSection;
