
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';
import TechnicalSkillCard from './TechnicalSkillCard';
import { useTechnicalSkills } from '@/hooks/api/useTechnicalSkills';

const mockSkills: TechnicalSkillData[] = [
  {
    id: "1",
    name: "Frontend Development",
    category: "Frontend Development",
    proficiency: 92,
    skills: [
      "React", "Next.js", "Vue", "TypeScript", "Tailwind CSS", "CSS/SCSS", "JavaScript", "HTML5"
    ],
    sort_order: 1
  },
  {
    id: "2",
    name: "Backend Development",
    category: "Backend Development",
    proficiency: 85,
    skills: [
      "Node.js", "Express", "NestJS", "Python", "Django", "REST API", "GraphQL", "PostgreSQL"
    ],
    sort_order: 2
  },
  {
    id: "3",
    name: "Design & UX",
    category: "Design & UX",
    proficiency: 88,
    skills: [
      "Figma", "Adobe XD", "Adobe Photoshop", "Wireframing", "Prototyping", "User Testing"
    ],
    sort_order: 3
  }
];

const TechnicalSkillsGrid: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Use the hook but fallback to mockSkills if data is not available
  const { data: skills, isLoading } = useTechnicalSkills();
  const displaySkills = skills && skills.length > 0 ? skills : mockSkills;
  
  // Variants for the container animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Variants for each skill card
  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div ref={ref} className="py-10">
      <h2 className="text-2xl font-bold text-white mb-8">Technical Skills</h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {displaySkills.map((skill) => (
          <motion.div key={skill.id} variants={skillVariants}>
            <TechnicalSkillCard data={skill} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechnicalSkillsGrid;
