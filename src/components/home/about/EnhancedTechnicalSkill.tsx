
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
  const proficiency = skill.proficiency ?? 75; // Default to 75% if proficiency is not provided
  const name = skill.name ?? skill.category; // Use category as fallback for name

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      className="flex flex-col h-full"
    >
      <div className="bg-gradient-to-br from-elvis-darker to-elvis-dark p-5 rounded-xl border border-elvis-medium/30 shadow-md h-full">
        <h4 className="font-medium text-white mb-2">{name}</h4>
        
        <div className="w-full bg-elvis-darker/50 h-2 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-elvis-pink to-elvis-purple h-full rounded-full"
            style={{ width: `${proficiency}%` }}
          ></div>
        </div>
        
        <p className="text-white/50 text-xs">
          {skill.description || `Proficiency: ${proficiency}%`}
        </p>

        {/* Display individual skills if available */}
        {skill.skills && skill.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {skill.skills.map((item, index) => (
              <span 
                key={index} 
                className="bg-elvis-medium/40 text-white/70 text-xs px-2 py-1 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedTechnicalSkill;
