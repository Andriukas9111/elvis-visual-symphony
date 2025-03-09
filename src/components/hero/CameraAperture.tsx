
import React from 'react';
import { motion } from 'framer-motion';

const CameraAperture: React.FC = () => {
  return (
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
  );
};

export default CameraAperture;
