
import React from 'react';
import { motion } from 'framer-motion';
import TechnicalSkillCard from './TechnicalSkillCard';
import { TechnicalSkillData } from './types';

const TechnicalSkillsGrid = () => {
  // Mock data for technical skills
  const technicalSkills: TechnicalSkillData[] = [
    {
      id: '1',
      name: 'Web Development',
      category: 'Development',
      proficiency: 90,
      icon_name: 'Code',
      color: '#61DAFB',
      skills: ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'JavaScript', 'TypeScript']
    },
    {
      id: '2',
      name: 'Mobile Development',
      category: 'Development',
      proficiency: 85,
      icon_name: 'Smartphone',
      color: '#3DDC84',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin']
    },
    {
      id: '3',
      name: 'UI/UX Design',
      category: 'Design',
      proficiency: 88,
      icon_name: 'Palette',
      color: '#FF7262',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Prototyping']
    }
  ];

  // Function to filter skills by category
  const filterSkillsByCategory = (category: string) => {
    return technicalSkills.filter(skill => skill.category === category);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {technicalSkills.map((skill) => (
        <TechnicalSkillCard key={skill.id} skill={skill} />
      ))}
    </motion.div>
  );
};

export default TechnicalSkillsGrid;
