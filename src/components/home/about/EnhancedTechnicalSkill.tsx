
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';

export interface EnhancedTechnicalSkillProps {
  skill: TechnicalSkillData;
}

const EnhancedTechnicalSkill: React.FC<EnhancedTechnicalSkillProps> = ({ skill }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark p-6 rounded-xl border border-elvis-medium/30 shadow-md mb-4"
    >
      <h3 className="text-xl font-bold text-white mb-3">{skill.category}</h3>
      <div className="flex flex-wrap gap-2">
        {skill.skills.map((skillName, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-elvis-pink/10 border border-elvis-pink/20 text-white rounded-full text-sm"
          >
            {skillName}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedTechnicalSkill;
