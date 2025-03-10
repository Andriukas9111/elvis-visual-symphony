
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { statsData } from './about/data';
import AboutHeader from './about/AboutHeader';
import ProfileImage from './about/ProfileImage';
import StatsGrid from './about/StatsGrid';
import BioSection from './about/BioSection';
import UnifiedExpertiseContainer from './about/UnifiedExpertiseContainer';

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isInView) return;

    const targetValues = statsData.map(stat => parseInt(stat.value.replace(/\D/g, '')));
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCounters(targetValues.map(value => Math.floor(value * progress)));
      
      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [isInView]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-24 bg-elvis-dark relative overflow-hidden"
    >
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-elvis-pink/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-elvis-purple/10 blur-[120px] rounded-full"></div>
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-neon-grid bg-grid-lg opacity-20"></div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-1/4 w-32 h-32 border border-elvis-pink/20 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-40 right-1/4 w-48 h-48 border border-elvis-purple/20 rounded-full"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 6,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      ></motion.div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AboutHeader isInView={isInView} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Profile & Stats */}
          <motion.div
            className="lg:col-span-4 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ProfileImage isInView={isInView} />
            <StatsGrid 
              stats={statsData} 
              counters={counters} 
              isInView={isInView} 
            />
          </motion.div>
          
          {/* Right Column: Bio & Unified Expertise Container */}
          <motion.div 
            className="lg:col-span-8 space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <BioSection 
              variants={containerVariants} 
              itemVariants={itemVariants} 
            />
            
            {/* Unified Expertise Container */}
            <UnifiedExpertiseContainer isInView={isInView} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
