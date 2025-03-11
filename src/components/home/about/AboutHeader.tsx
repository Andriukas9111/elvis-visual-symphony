
import React from 'react';
import { useAboutContent } from '@/hooks/api/useAboutContent';
import { motion } from 'framer-motion';

const AboutHeader = () => {
  const { aboutData, isLoading } = useAboutContent();

  if (isLoading) return null;

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
      </motion.div>
    </div>
  );
};

export default AboutHeader;
