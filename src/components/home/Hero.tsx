
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-elvis-darker via-elvis-dark to-elvis-medium">
        {/* Abstract pattern overlay */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-elvis-purple/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-elvis-pink/20 blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-elvis-purple/30 blur-[70px] animate-pulse"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-black/30 opacity-70"
          style={{ background: 'radial-gradient(circle, transparent 40%, black 140%)' }}>
        </div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {isVisible && (
            <>
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white">Elevate Your Vision with</span>
                <br />
                <motion.span 
                  className="text-gradient font-script"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Elvis Creative
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Premium Photography & Videography Solutions for Creators Who Demand Excellence
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Button asChild className="bg-elvis-gradient text-white rounded-full px-8 py-6 text-lg shadow-pink-glow hover:shadow-purple-glow transition-all duration-300 group">
                  <Link to="/portfolio">
                    <span>Explore Our Work</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="border-elvis-pink text-white rounded-full px-8 py-6 text-lg hover:bg-elvis-pink/10 transition-all duration-300">
                  <Link to="/shop">Shop LUTs</Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: 0 
        }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <p className="text-white/70 text-sm uppercase tracking-widest">Discover</p>
          <div className="relative w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1.5 h-1.5 bg-elvis-pink rounded-full absolute top-2"
              animate={{ 
                y: [0, 16, 0], 
                opacity: [1, 0.5, 1] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
