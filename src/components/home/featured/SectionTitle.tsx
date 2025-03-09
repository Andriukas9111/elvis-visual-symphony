
import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = () => {
  return (
    <motion.div 
      className="mb-12 text-center"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6 }
        }
      }}
    >
      <motion.h2 
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tighter"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, delay: 0.2 }
          }
        }}
      >
        <span className="text-gradient">Featured</span> Projects
      </motion.h2>
      
      <motion.p 
        className="text-white/70 max-w-2xl mx-auto"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, delay: 0.3 }
          }
        }}
      >
        Browse my collection of cinematic storytelling — from immersive vertical stories 
        to widescreen productions that capture the essence of each project.
      </motion.p>
    </motion.div>
  );
};

export default SectionTitle;
