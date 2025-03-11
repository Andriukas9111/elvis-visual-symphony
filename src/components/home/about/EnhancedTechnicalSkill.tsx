
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';

export interface EnhancedTechnicalSkillProps {
  skill: TechnicalSkillData;
  delay?: number;
}

const EnhancedTechnicalSkill: React.FC<EnhancedTechnicalSkillProps> = ({ 
  skill, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      className="flex flex-col h-full"
    >
      <div className="bg-gradient-to-br from-elvis-darker to-elvis-dark p-5 rounded-xl border border-elvis-medium/30 shadow-md h-full">
        <h4 className="font-medium text-white mb-2">{skill.name}</h4>
        
        <div className="w-full bg-elvis-darker/50 h-2 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-elvis-pink to-elvis-purple h-full rounded-full"
            style={{ width: `${skill.proficiency}%` }}
          ></div>
        </div>
        
        <p className="text-white/50 text-xs">
          {skill.description || `Proficiency: ${skill.proficiency}%`}
        </p>
      </div>
    </motion.div>
  );
};

export default EnhancedTechnicalSkill;
