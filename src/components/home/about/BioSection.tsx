
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
      <motion.div className="flex items-center mb-6" variants={itemVariants}>
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-3xl font-bold">My Story</h3>
        <motion.div 
          className="ml-auto h-px bg-elvis-gradient flex-grow max-w-[100px] opacity-50"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>
      
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
      
      {/* Decorative elements */}
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
      />
      <motion.div
        className="absolute -left-10 top-1/2 w-16 h-16 border border-elvis-purple/20 rounded-full"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div 
        className="absolute -bottom-5 left-1/4 w-40 h-1 bg-elvis-gradient rounded-full opacity-20"
        animate={{ 
          width: ['10rem', '15rem', '10rem'],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default BioSection;
