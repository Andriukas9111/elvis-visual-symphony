
import React from 'react';
import { motion } from 'framer-motion';
import { SkillCategory, containerVariants, itemVariants } from './types';
import IconRenderer from './IconRenderer';

interface TechnicalSkillsTabContentProps {
  skillCategories?: SkillCategory[];
  isLoading: boolean;
}

const TechnicalSkillsTabContent: React.FC<TechnicalSkillsTabContentProps> = ({ skillCategories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-8 w-48 bg-elvis-medium rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-6 bg-elvis-medium rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {skillCategories?.map((category) => (
        <motion.div key={category.id} className="bg-elvis-medium rounded-xl p-6" variants={itemVariants}>
          <h3 className="font-bold text-xl mb-6 flex items-center">
            {category.icon && (
              <div className="w-10 h-10 rounded-full bg-elvis-pink flex items-center justify-center mr-3">
                <IconRenderer iconName={category.icon} />
              </div>
            )}
            {category.name}
          </h3>
          <div className="space-y-6">
            {category.skills?.map((skill) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between">
                  <span>{skill.name}</span>
                  <span>{skill.proficiency}%</span>
                </div>
                <div className="h-2 w-full bg-elvis-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-elvis-pink rounded-full" 
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TechnicalSkillsTabContent;
