
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { setFirstVisit } = useAnimation();
  
  useEffect(() => {
    // Simulate asset loading with progress
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (progress === 100) {
      // Delay to show 100% for a moment
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        setFirstVisit(false);
        setTimeout(onLoadingComplete, 1000); // Allow exit animation to complete
      }, 800);
      
      return () => clearTimeout(completeTimer);
    }
  }, [progress, onLoadingComplete, setFirstVisit]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  };
  
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const progressVariants = {
    hidden: { width: "0%" },
    visible: (value: number) => ({
      width: `${value}%`,
      transition: { duration: 0.4, ease: "easeOut" }
    })
  };
  
  const shutterVariants = {
    hidden: { scaleY: 0 },
    visible: { 
      scaleY: 1, 
      transition: { 
        repeat: 3, 
        repeatType: "mirror", 
        duration: 0.3, 
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-50 bg-elvis-darker flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative flex flex-col items-center space-y-8">
            {/* Camera shutter animation */}
            <motion.div 
              className="absolute inset-0 bg-elvis-pink/10"
              variants={shutterVariants}
              initial="hidden"
              animate="visible"
            />
            
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient">Elvis</span>
                <span className="text-white ml-2">Creative</span>
              </h1>
            </motion.div>
            
            {/* Progress bar */}
            <div className="w-64 md:w-80 h-1 bg-elvis-medium rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-elvis-gradient"
                variants={progressVariants}
                initial="hidden"
                animate="visible"
                custom={progress}
              />
            </div>
            
            {/* Progress text */}
            <motion.p 
              className="text-white/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.round(progress)}% - Loading {progress < 30 ? "Lenses" : progress < 60 ? "Cameras" : progress < 90 ? "Lights" : "Creative Magic"}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
