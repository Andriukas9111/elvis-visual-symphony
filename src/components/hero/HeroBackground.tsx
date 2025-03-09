
import React, { useRef, useEffect } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface HeroBackgroundProps {
  scrollYProgress: MotionValue<number>;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ scrollYProgress }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Parallax effect for the background
      heroRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Background with parallax effect */}
      <motion.div 
        ref={heroRef}
        className="absolute inset-0 z-0 w-[110%] h-[110%] bg-gradient-to-br from-elvis-darker via-elvis-medium to-elvis-dark transition-transform duration-200 ease-out"
        style={{ y }}
      >
        <div className="absolute inset-0 opacity-30">
          {/* Abstract pattern overlay */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-elvis-purple/20 blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-elvis-pink/20 blur-[100px] animate-float animation-delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-elvis-purple/30 blur-[70px] animate-pulse"></div>
        </div>
        
        {/* Cinematic scan lines */}
        <div className="absolute inset-0 z-10 bg-repeat opacity-5" 
          style={{ 
            backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)', 
            backgroundSize: '100% 4px' 
          }}
        ></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 z-10 opacity-70"
          style={{
            background: 'radial-gradient(circle, transparent 40%, black 140%)'
          }}
        ></div>
      </motion.div>

      {/* Cinematic overlay effect */}
      <div className="absolute inset-0 z-0 bg-black/20 mix-blend-overlay"></div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-[5]"></div>
    </>
  );
};

export default HeroBackground;
