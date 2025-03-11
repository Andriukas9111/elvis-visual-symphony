
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  background_color: string;
  order_index: number;
}

interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: string;
  background_color: string;
  order_index: number;
}

interface TechnicalSkill {
  id: string;
  title: string;
  description?: string;
  category: string;
  icon?: string;
  background_color: string;
  proficiency: number;
  order_index: number;
}

interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  order_index: number;
}

type TabType = 'expertise' | 'projects' | 'skills';

const ExpertiseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('expertise');
  
  const { data: expertiseItems } = useQuery({
    queryKey: ['expertiseItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise_items')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ExpertiseItem[];
    }
  });
  
  const { data: projectTypes } = useQuery({
    queryKey: ['projectTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_types')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ProjectType[];
    }
  });
  
  const { data: technicalSkills } = useQuery({
    queryKey: ['technicalSkills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as TechnicalSkill[];
    }
  });
  
  const { data: skillCategories } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as SkillCategory[];
    }
  });
  
  // Group technical skills by category
  const groupedSkills = React.useMemo(() => {
    if (!technicalSkills || !skillCategories) return {};
    
    return technicalSkills.reduce<Record<string, TechnicalSkill[]>>((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [technicalSkills, skillCategories]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <section className="py-16">
      <SectionHeading 
        title="My Expertise" 
        subtitle="Specialized skills and knowledge areas I've developed over my career"
      />
      
      <div className="mb-10 border-b border-gray-700">
        <div className="flex space-x-4 sm:space-x-8">
          <button
            className={`pb-3 px-2 relative ${activeTab === 'expertise' ? 'text-elvis-pink' : 'text-white hover:text-elvis-pink/80'}`}
            onClick={() => setActiveTab('expertise')}
          >
            Expertise
            {activeTab === 'expertise' && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-1 bg-elvis-pink"
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button
            className={`pb-3 px-2 relative ${activeTab === 'projects' ? 'text-elvis-pink' : 'text-white hover:text-elvis-pink/80'}`}
            onClick={() => setActiveTab('projects')}
          >
            Project Types
            {activeTab === 'projects' && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-1 bg-elvis-pink"
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button
            className={`pb-3 px-2 relative ${activeTab === 'skills' ? 'text-elvis-pink' : 'text-white hover:text-elvis-pink/80'}`}
            onClick={() => setActiveTab('skills')}
          >
            Technical Skills
            {activeTab === 'skills' && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-1 bg-elvis-pink"
                layoutId="tabIndicator"
              />
            )}
          </button>
        </div>
      </div>
      
      <div className="min-h-[400px]">
        {/* Expertise Tab */}
        {activeTab === 'expertise' && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {expertiseItems?.map(item => (
              <motion.div
                key={item.id}
                variants={item}
                className="rounded-lg p-6 h-full"
                style={{ backgroundColor: item.background_color || '#2A1E30' }}
              >
                <div className="text-3xl text-elvis-pink mb-4">
                  <i className={`${item.icon}`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Project Types Tab */}
        {activeTab === 'projects' && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {projectTypes?.map(project => (
              <motion.div
                key={project.id}
                variants={item}
                className="rounded-lg p-6 h-full"
                style={{ backgroundColor: project.background_color || '#2A1E30' }}
              >
                <div className="text-3xl text-elvis-pink mb-4">
                  <i className={`${project.icon}`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-white/70">{project.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Technical Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div 
            className="space-y-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {skillCategories?.map(category => (
              <motion.div
                key={category.id}
                variants={item}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  {category.icon && <i className={`${category.icon} text-elvis-pink text-2xl`}></i>}
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedSkills[category.name]?.map(skill => (
                    <div 
                      key={skill.id} 
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: skill.background_color || '#2A1E30' }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{skill.title}</h4>
                        <span className="text-sm text-white/70">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-elvis-pink h-2 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      {skill.description && (
                        <p className="mt-2 text-sm text-white/70">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExpertiseSection;
