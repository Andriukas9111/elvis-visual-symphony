
import React from 'react';
import { useAboutContent } from '@/hooks/api/useAboutContent';
import { motion } from 'framer-motion';

const AboutHeader = () => {
  const { aboutData, isLoading } = useAboutContent();

  if (isLoading) return (
    <div className="container mx-auto px-4">
      <div className="text-center space-y-4">
        <div className="h-12 w-64 mx-auto bg-gray-700 animate-pulse rounded mb-4"></div>
        <div className="h-4 w-96 mx-auto bg-gray-700 animate-pulse rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          <span className="text-white">About </span>
          <span className="text-primary font-display">Elvis Creative</span>
        </h1>
        {aboutData?.about_content?.subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {aboutData.about_content.subtitle}
          </p>
        )}
        {aboutData?.about_content?.role && (
          <p className="text-primary/90 text-lg font-medium">
            {aboutData.about_content.role}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AboutHeader;
