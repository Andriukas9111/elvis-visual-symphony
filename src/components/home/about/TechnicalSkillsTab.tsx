
import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/api/useSkills';
import TechnicalSkillCard from '@/components/ui/about/SkillCard';
import { fadeInUpVariant } from '@/types/about.types';

const TechnicalSkillsTab = () => {
  const { data: skills = [], isLoading } = useSkills();

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-elvis-dark/50 rounded-xl animate-pulse" />
      ))}
    </div>;
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={fadeInUpVariant}
      initial="hidden"
      animate="visible"
    >
      {skills.map((skill, index) => (
        <TechnicalSkillCard 
          key={skill.id} 
          skill={skill}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default TechnicalSkillsTab;
