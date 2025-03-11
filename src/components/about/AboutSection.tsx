
import React from 'react';
import { motion } from 'framer-motion';
import SocialStatsSection from './SocialStatsSection';
import MyStorySection from './MyStorySection';
import AccomplishmentsSection from './AccomplishmentsSection';
import { ExpertiseSection } from './expertise';
import TestimonialsSection from './TestimonialsSection';
import ConnectSection from './ConnectSection';

const AboutSection: React.FC = () => {
  return (
    <section className="relative bg-elvis-darker min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-elvis-purple/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-elvis-pink/20 blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-elvis-purple/30 blur-[70px] animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,255,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(255,0,255,0.07)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-elvis-darker opacity-60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 space-y-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            About <span className="text-elvis-pink">Elvis Creative</span>
          </h1>
          <p className="text-lg text-gray-400">
            Professional videographer and cinematographer with over 8 years 
            of experience creating visual stories that captivate and inspire 
            audiences worldwide.
          </p>
        </motion.div>

        {/* Content Sections */}
        <SocialStatsSection />
        <MyStorySection />
        <AccomplishmentsSection />
        <ExpertiseSection />
        <TestimonialsSection />
        <ConnectSection />
      </div>
    </section>
  );
};

export default AboutSection;
