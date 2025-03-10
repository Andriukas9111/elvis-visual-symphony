
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { skills } from './data';
import Card3D from '../../hire-me/Card3D';

interface SkillsSectionProps {
  variants: Variants;
  itemVariants: Variants;
}

const SkillsSection = ({ variants, itemVariants }: SkillsSectionProps) => {
  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <motion.div className="flex items-center mb-6" variants={itemVariants}>
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-3xl font-bold">Areas of Expertise</h3>
        <motion.div 
          className="ml-auto h-px bg-elvis-gradient flex-grow max-w-[100px] opacity-50"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={itemVariants}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <Card3D>
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4 bg-elvis-medium/80 w-16 h-16 rounded-full flex items-center justify-center shadow-pink-glow">
                  <motion.div 
                    className="text-elvis-pink"
                    whileHover={{ rotate: 5 }}
                    animate={{ 
                      boxShadow: ['0 0 0 rgba(255, 0, 255, 0.3)', '0 0 20px rgba(255, 0, 255, 0.6)', '0 0 0 rgba(255, 0, 255, 0.3)'],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {skill.icon}
                  </motion.div>
                </div>
                <h3 className="font-bold text-xl mb-2">{skill.label}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{skill.description}</p>
              </div>
            </Card3D>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SkillsSection;
