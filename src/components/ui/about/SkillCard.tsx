
import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const Icon = skill.icon_name ? getDynamicIcon(skill.icon_name) : null;
  
  return (
    <motion.div
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-5 rounded-xl border border-elvis-medium/20 shadow-md h-full"
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
    >
      {Icon && (
        <div className="bg-elvis-purple/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-elvis-pink" strokeWidth={1.5} />
        </div>
      )}
      
      <h4 className="font-medium text-white mb-2">{skill.name}</h4>
      
      <div className="w-full bg-elvis-darker/50 h-2 rounded-full overflow-hidden mb-2">
        <motion.div 
          className="bg-gradient-to-r from-elvis-pink to-elvis-purple h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
          viewport={{ once: true }}
        />
      </div>
      
      <p className="text-white/50 text-xs">
        {skill.description || `Proficiency: ${skill.proficiency}%`}
      </p>
    </motion.div>
  );
};

export default SkillCard;
