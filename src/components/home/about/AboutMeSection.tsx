
import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface AboutMeSectionProps {
  content: string;
  isLoading: boolean;
  isInView: boolean;
}

const AboutMeSection: React.FC<AboutMeSectionProps> = ({ content, isLoading, isInView }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  return (
    <motion.div
      className="prose prose-invert max-w-none mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center mb-6">
        <span className="h-6 w-1 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-xl font-bold">My Story</h3>
      </div>
      
      <div 
        className="text-white/80 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.div>
  );
};

export default AboutMeSection;
