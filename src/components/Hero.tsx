
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTextVisible, setIsTextVisible] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !textRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Parallax effect for the background
      heroRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      
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

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };
  
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
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-elvis-dark flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Cinematic overlay effect */}
      <div className="absolute inset-0 z-0 bg-black/20 mix-blend-overlay"></div>
      
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

      {/* Content */}
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

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        onClick={scrollToNextSection}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isTextVisible ? 1 : 0, 
          y: 0,
          transition: { delay: 1.2, duration: 0.5 } 
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

      {/* Camera aperture animation in corner */}
      <div className="absolute bottom-6 right-6 z-10 opacity-70">
        <motion.div 
          className="w-12 h-12 rounded-full border-2 border-elvis-pink/50 flex items-center justify-center"
          animate={{ 
            scale: [1, 0.9, 1],
            borderColor: ['rgba(255,0,255,0.5)', 'rgba(176,38,255,0.5)', 'rgba(255,0,255,0.5)']
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <motion.div 
            className="w-6 h-6 rounded-full border border-elvis-pink/70 flex items-center justify-center"
            animate={{ 
              scale: [1, 0.7, 1] 
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
          >
            <motion.div 
              className="w-2 h-2 bg-elvis-pink rounded-full"
              animate={{ 
                scale: [1, 0.5, 1] 
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-[5]"></div>
    </motion.div>
  );
};

export default Hero;
