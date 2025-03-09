
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroContent: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Subtle text movement
      textRef.current.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Show text with slight delay for dramatic effect
    const timer = setTimeout(() => {
      setIsTextVisible(true);
    }, 300);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const wordVariants = {
    hidden: { 
      y: 50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.6
      }
    }
  };
  
  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  // Split title into words for animation
  const titleWords = ["Elevate", "Your", "Vision", "with"];

  return (
    <motion.div 
      ref={textRef}
      className="relative z-10 text-center px-4 max-w-4xl mx-auto transition-transform duration-200 ease-out"
    >
      {isTextVisible && (
        <>
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {titleWords.map((word, i) => (
              <motion.span key={i} className="inline-block mr-3 text-white" variants={wordVariants}>
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span 
              className="text-gradient font-script"
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              Elvis Creative
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            variants={paragraphVariants}
            initial="hidden"
            animate="visible"
          >
            Premium Photography & Videography Solutions for Creators Who Demand Excellence
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            variants={buttonContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={buttonVariants}>
              <Button asChild className="bg-elvis-gradient text-white rounded-full px-8 py-6 text-lg shadow-pink-glow hover:shadow-purple-glow transition-all duration-300 group relative overflow-hidden">
                <Link to="/portfolio">
                  <span className="relative z-10">Explore Our Work</span>
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform relative z-10">→</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div variants={buttonVariants}>
              <Button asChild variant="outline" className="border-elvis-pink text-white rounded-full px-8 py-6 text-lg hover:bg-elvis-pink/10 transition-all duration-300">
                <Link to="/shop">Shop LUTs</Link>
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default HeroContent;
