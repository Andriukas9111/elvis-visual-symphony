
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { statsData, skills, testimonials } from './about/data';
import AboutHeader from './about/AboutHeader';
import ProfileImage from './about/ProfileImage';
import StatsGrid from './about/StatsGrid';
import BioSection from './about/BioSection';
import SkillsSection from './about/SkillsSection';
import TestimonialsSection from './about/TestimonialsSection';

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
      className="py-20 bg-elvis-dark relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-elvis-pink/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-elvis-purple/10 blur-[100px] rounded-full"></div>
      <div className="absolute top-1/4 left-1/3 w-24 h-24 border border-elvis-pink/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/3 w-32 h-32 border border-elvis-purple/10 rounded-full animate-float"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AboutHeader isInView={isInView} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Photo Column */}
          <div className="lg:col-span-5">
            <ProfileImage isInView={isInView} />
            
            {/* Stats Cards */}
            <StatsGrid 
              stats={statsData} 
              counters={counters} 
              isInView={isInView} 
            />
          </div>
          
          {/* Content Column */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <BioSection 
              variants={containerVariants} 
              itemVariants={itemVariants} 
            />
            
            {/* Skills section */}
            <SkillsSection 
              skills={skills} 
              isInView={isInView} 
              itemVariants={itemVariants} 
            />
          </motion.div>
        </div>
        
        {/* Testimonials Section */}
        <TestimonialsSection testimonials={testimonials} isInView={isInView} />
      </div>
    </section>
  );
};

export default About;
