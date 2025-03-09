
import React from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  isVisible: boolean;
  onClick: () => void;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ isVisible, onClick }) => {
  return (
    <motion.div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
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
  );
};

export default ScrollIndicator;
