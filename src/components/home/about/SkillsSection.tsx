
import React from 'react';
import { motion, Variants } from 'framer-motion';
import Card3D from '../../hire-me/Card3D';
import { SkillItem } from './types';

interface SkillsSectionProps {
  skills: SkillItem[];
  isInView: boolean;
  itemVariants: Variants;
}

const SkillsSection = ({ skills, isInView, itemVariants }: SkillsSectionProps) => {
  return (
    <motion.div variants={itemVariants} className="pt-8 relative">
      <h4 className="text-2xl font-bold mb-8 flex items-center">
        <span className="h-6 w-1.5 bg-elvis-purple rounded-full mr-3"></span>
        Areas of Expertise
      </h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <Card3D>
              <div className="p-5 text-center h-full">
                <div className="flex justify-center mb-4">
                  <motion.div 
                    className="h-14 w-14 rounded-full bg-elvis-medium flex items-center justify-center text-elvis-pink"
                    whileHover={{ rotate: 5 }}
                    animate={{ 
                      boxShadow: ['0 0 0 rgba(255, 0, 255, 0.3)', '0 0 20px rgba(255, 0, 255, 0.6)', '0 0 0 rgba(255, 0, 255, 0.3)'],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {skill.icon}
                  </motion.div>
                </div>
                <p className="font-medium text-lg">{skill.label}</p>
              </div>
            </Card3D>
          </motion.div>
        ))}
      </div>
      
      {/* Decorative element */}
      <motion.div
        className="absolute left-1/2 -bottom-16 w-32 h-1 bg-elvis-gradient rounded-full opacity-30"
        animate={{ 
          width: ['8rem', '12rem', '8rem'],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
    </motion.div>
  );
};

export default SkillsSection;
