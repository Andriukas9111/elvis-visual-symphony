
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface BioSectionProps {
  variants: Variants;
  itemVariants: Variants;
}

const BioSection = ({ variants, itemVariants }: BioSectionProps) => {
  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <motion.h3 
        className="text-3xl font-bold inline-flex items-center space-x-2 mb-6"
        variants={itemVariants}
      >
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        My Story
      </motion.h3>
      
      <motion.div 
        className="text-white/90 space-y-6 prose prose-invert max-w-none text-lg leading-relaxed"
        variants={itemVariants}
      >
        <p className="relative">
          <span className="text-elvis-pink text-2xl font-script absolute -left-6">Hi</span>
          Hi there! My name is Elvis and I'm a videographer based in the United Kingdom. I originally come from Lithuania, a small country located in the centre of Europe. I like to say that I was put on this earth to make videos and share my vision with others.
        </p>
        
        <p>
          I filmed and edited my first "project" when I was around 10 years old and from that moment I already knew what my career path will be. I never tried looking for anything else that I'd like to do and just stuck with filming and editing videos.
        </p>
        
        <p>
          I grew up in the times when social media was just becoming the thing so I closely watched how this space evolved into what it is now. I'm very familiar with the idea of social media and what type of content works for different niches, which makes me capable of narrowing down exactly what clients are looking for and help them to promote their content/product.
        </p>
      </motion.div>
      
      {/* Decorative element */}
      <motion.div
        className="absolute right-0 -bottom-10 w-24 h-24 border border-elvis-pink/20 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
    </motion.div>
  );
};

export default BioSection;
