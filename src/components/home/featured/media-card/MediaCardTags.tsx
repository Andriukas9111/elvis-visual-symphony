
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

interface MediaCardTagsProps {
  tags: string[];
}

const MediaCardTags: React.FC<MediaCardTagsProps> = ({ tags }) => {
  const { prefersReducedMotion } = useAnimation();

  const tagVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const tagContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (!tags || tags.length === 0) return null;

  return (
    <motion.div 
      className="mt-3 flex flex-wrap items-center justify-center gap-2"
      variants={!prefersReducedMotion ? tagContainerVariants : {}}
      initial="initial"
      animate="animate"
    >
      {tags.map((tag, index) => (
        <motion.span 
          key={index} 
          className="inline-block bg-elvis-darker text-xs px-2 py-1 rounded-full text-gray-300 border border-elvis-pink/20"
          variants={!prefersReducedMotion ? tagVariants : {}}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 0, 255, 0.1)" }}
        >
          {tag}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default MediaCardTags;
