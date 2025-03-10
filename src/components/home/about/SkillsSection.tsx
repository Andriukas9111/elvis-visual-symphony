
import React from 'react';
import { motion } from 'framer-motion';
import Card3D from '../../hire-me/Card3D';
import { SkillItem } from './types';

interface SkillsSectionProps {
  skills: SkillItem[];
  isInView: boolean;
  itemVariants: any;
}

const SkillsSection = ({ skills, isInView, itemVariants }: SkillsSectionProps) => {
  return (
    <motion.div variants={itemVariants} className="pt-4">
      <h4 className="text-xl font-bold mb-6 flex items-center">
        <span className="h-5 w-1 bg-elvis-purple rounded-full mr-2"></span>
        Areas of Expertise
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
            whileHover={{ y: -5 }}
          >
            <Card3D>
              <div className="p-4 text-center h-full">
                <div className="flex justify-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-elvis-medium flex items-center justify-center text-elvis-pink">
                    {skill.icon}
                  </div>
                </div>
                <p className="font-medium">{skill.label}</p>
              </div>
            </Card3D>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection;
