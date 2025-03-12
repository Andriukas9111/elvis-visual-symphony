
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { TechnicalSkillData } from './types';

interface TechnicalSkillCardProps {
  category: TechnicalSkillData;
}

const TechnicalSkillCard = ({ category }: TechnicalSkillCardProps) => {
  // Animation variants
  const cardVariants: Variants = {
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="glass-card hover:border-elvis-pink/30 border border-white/10 rounded-xl p-6 transition-all"
    >
      <h4 className="text-xl font-bold mb-4">{category.category}</h4>
      
      <div className="space-y-2">
        {category.skills.map((skill, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-elvis-pink/70" />
            <p className="text-white/80">{skill}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TechnicalSkillCard;
