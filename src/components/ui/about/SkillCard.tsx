
import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';
import { Progress } from '@/components/ui/progress';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const Icon = skill.icon_name ? getDynamicIcon(skill.icon_name) : undefined;
  
  return (
    <motion.div
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-5 rounded-xl border border-elvis-medium/20 shadow-md"
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
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className="bg-elvis-pink/10 p-2 rounded-full">
            <Icon className="h-5 w-5 text-elvis-pink" strokeWidth={1.5} />
          </div>
        )}
        <h3 className="text-lg font-medium text-white">{skill.name}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Proficiency</span>
          <span className="text-white font-medium">{skill.proficiency}%</span>
        </div>
        <Progress value={skill.proficiency} className="h-2" />
      </div>
      
      {skill.description && (
        <p className="mt-3 text-sm text-white/70">{skill.description}</p>
      )}
    </motion.div>
  );
};

export default SkillCard;
