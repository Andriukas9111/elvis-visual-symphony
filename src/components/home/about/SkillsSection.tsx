
import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/api/useSkills';
import SkillCard from '@/components/ui/about/SkillCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer } from '@/types/about.types';

const SkillsSection: React.FC = () => {
  const { data: skills = [], isLoading } = useSkills();
  
  // Group skills by category
  const skillsByCategory = React.useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);
  }, [skills]);
  
  // Default skills if no skills in database
  const defaultSkills = {
    'Photography': [
      {
        id: '1',
        name: 'Portrait Photography',
        category: 'Photography',
        proficiency: 95,
        icon_name: 'Camera',
        description: 'Professional portrait photography for individuals and groups',
        sort_order: 0,
        created_at: '',
        updated_at: ''
      },
      {
        id: '2',
        name: 'Landscape Photography',
        category: 'Photography',
        proficiency: 90,
        icon_name: 'Mountain',
        description: 'Capturing stunning natural and urban landscapes',
        sort_order: 1,
        created_at: '',
        updated_at: ''
      }
    ],
    'Videography': [
      {
        id: '3',
        name: 'Cinematic Filming',
        category: 'Videography',
        proficiency: 98,
        icon_name: 'Film',
        description: 'Creating cinematic-quality video content',
        sort_order: 0,
        created_at: '',
        updated_at: ''
      },
      {
        id: '4',
        name: 'Video Editing',
        category: 'Videography',
        proficiency: 95,
        icon_name: 'Scissors',
        description: 'Professional video editing and post-production',
        sort_order: 1,
        created_at: '',
        updated_at: ''
      },
      {
        id: '5',
        name: 'Color Grading',
        category: 'Videography',
        proficiency: 92,
        icon_name: 'Palette',
        description: 'Advanced color grading and color correction',
        sort_order: 2,
        created_at: '',
        updated_at: ''
      }
    ],
    'Software': [
      {
        id: '6',
        name: 'Adobe Premiere Pro',
        category: 'Software',
        proficiency: 98,
        icon_name: 'Square',
        description: 'Expert-level video editing with Premiere Pro',
        sort_order: 0,
        created_at: '',
        updated_at: ''
      },
      {
        id: '7',
        name: 'Adobe After Effects',
        category: 'Software',
        proficiency: 90,
        icon_name: 'Square',
        description: 'Motion graphics and visual effects',
        sort_order: 1,
        created_at: '',
        updated_at: ''
      },
      {
        id: '8',
        name: 'DaVinci Resolve',
        category: 'Software',
        proficiency: 88,
        icon_name: 'Square',
        description: 'Professional color grading and editing',
        sort_order: 2,
        created_at: '',
        updated_at: ''
      }
    ]
  };
  
  // If database is empty, use default skills
  const displaySkillsByCategory = Object.keys(skillsByCategory).length > 0 
    ? skillsByCategory 
    : defaultSkills;
  
  if (isLoading) {
    return (
      <div>
        <div className="bg-elvis-medium/20 h-10 w-48 rounded mb-6"></div>
        <div className="space-y-8 animate-pulse">
          {[1, 2, 3].map((catIndex) => (
            <div key={catIndex}>
              <div className="bg-elvis-medium/20 h-6 w-32 rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-elvis-medium/20 rounded-xl h-32"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading 
        title="Technical Skills" 
        subtitle="Proficiency in industry-standard tools and techniques"
        accent="purple"
      />
      
      <div className="space-y-12">
        {Object.entries(displaySkillsByCategory).map(([category, categorySkills], categoryIndex) => (
          <div key={category} className="space-y-6">
            <motion.h3
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              {category}
            </motion.h3>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {categorySkills.map((skill, index) => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
