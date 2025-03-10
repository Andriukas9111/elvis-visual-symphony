
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';

interface EnhancedTechnicalSkillProps {
  skill: TechnicalSkillData;
  delay?: number;
}

const EnhancedTechnicalSkill: React.FC<EnhancedTechnicalSkillProps> = ({ 
  skill, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(255, 0, 255, 0.15)' 
      }}
      className="bg-gradient-to-br from-elvis-dark/80 to-elvis-light/40 rounded-xl border-2 border-elvis-pink/10 p-6"
    >
      <h4 className="text-xl font-bold text-white mb-3 relative inline-block">
        {skill.category}
        <div className="h-px w-full absolute -bottom-1 left-0 bg-gradient-to-r from-elvis-pink via-elvis-purple to-transparent"></div>
      </h4>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {skill.skills && skill.skills.map((item, idx) => (
          <motion.span 
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay * 0.1 + idx * 0.05 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 0, 255, 0.2)'
            }}
            className="bg-elvis-pink/10 text-white/90 px-4 py-1.5 rounded-full text-sm border border-elvis-pink/30 transition-all"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedTechnicalSkill;
