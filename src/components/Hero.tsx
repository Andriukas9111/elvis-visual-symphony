
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import ScrollIndicator from './hero/ScrollIndicator';
import CameraAperture from './hero/CameraAperture';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Show text with slight delay for dramatic effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-elvis-dark flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Background Elements */}
      <HeroBackground scrollYProgress={scrollYProgress} />
      
      {/* Main Content */}
      <HeroContent />
      
      {/* Scroll Indicator */}
      <ScrollIndicator isVisible={isTextVisible} onClick={scrollToNextSection} />

      {/* Camera Aperture Animation */}
      <CameraAperture />
    </motion.div>
  );
};

export default Hero;
