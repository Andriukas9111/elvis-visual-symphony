
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { TechnicalSkillData } from './types';

interface TechnicalSkillCardProps {
  category: TechnicalSkillData;
}

const TechnicalSkillCard = ({ category }: TechnicalSkillCardProps) => {
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants} 
      className="glass-card p-6 border border-white/10 hover:border-elvis-pink/30 transition-all relative overflow-hidden rounded-xl"
    >
      <h4 className="text-xl font-bold mb-4 text-white">{category.category}</h4>
      <ul className="space-y-2">
        {category.skills.map((skill, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-elvis-pink mr-2"></span>
            <span className="text-white/80">{skill}</span>
          </motion.li>
        ))}
      </ul>
      <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-elvis-pink/5 rounded-full blur-xl"></div>
    </motion.div>
  );
};

export default TechnicalSkillCard;
