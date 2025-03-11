
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';

interface TechnicalSkillsTabProps {
  isInView: boolean;
}

const TechnicalSkillsTab: React.FC<TechnicalSkillsTabProps> = ({ 
  isInView
}) => {
  // Mock technical skills data - in a real application you would fetch this from an API
  const technicalSkills: TechnicalSkillData[] = [
    {
      id: '1',
      category: 'Photography',
      skills: ['Portrait Photography', 'Landscape Photography', 'Studio Lighting', 'Photo Editing']
    },
    {
      id: '2',
      category: 'Videography',
      skills: ['Cinematic Filming', 'Video Editing', 'Color Grading', 'Aerial Videography']
    },
    {
      id: '3',
      category: 'Software',
      skills: ['Adobe Photoshop', 'Adobe Premiere Pro', 'Adobe Lightroom', 'Final Cut Pro', 'DaVinci Resolve']
    }
  ];
  
  return (
    <div className="space-y-8">
      {technicalSkills.map((skill, categoryIndex) => (
        <div key={skill.id} className="space-y-4">
          <h3 className="text-xl font-bold text-white">{skill.category}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {skill.skills?.map((skillItem, index) => (
              <motion.div
                key={`${skill.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: (categoryIndex * 0.2) + (index * 0.05) }}
                className="bg-elvis-dark/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80"
              >
                {skillItem}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicalSkillsTab;
