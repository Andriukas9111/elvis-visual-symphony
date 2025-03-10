
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ExpertiseData } from './types';

const ExpertiseCard = ({ expertise }: { expertise: ExpertiseData }) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      } 
    }
  };
  
  return (
    <motion.div
      variants={variants}
      className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/30 transition-all group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 bg-elvis-medium/80 w-14 h-14 rounded-full flex items-center justify-center shadow-pink-glow">
          <div className="text-elvis-pink">
            {expertise.icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">{expertise.label}</h3>
        <p className="text-white/70 text-sm">{expertise.description}</p>
      </div>
    </motion.div>
  );
};

export default ExpertiseCard;
