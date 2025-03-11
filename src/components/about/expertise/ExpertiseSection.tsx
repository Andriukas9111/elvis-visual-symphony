
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from '../SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpertiseTabContent from './ExpertiseTabContent';
import ProjectTypesTabContent from './ProjectTypesTabContent';
import TechnicalSkillsTabContent from './TechnicalSkillsTabContent';
import { ExpertiseItem, ProjectType, SkillCategory } from './types';

const ExpertiseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("expertise");
  
  const { data: expertiseItems, isLoading: loadingExpertise } = useQuery({
    queryKey: ['expertise_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise_items')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ExpertiseItem[];
    }
  });
  
  const { data: projectTypes, isLoading: loadingProjects } = useQuery({
    queryKey: ['project_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_types')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ProjectType[];
    }
  });
  
  const { data: skillCategories, isLoading: loadingSkills } = useQuery({
    queryKey: ['skill_categories'],
    queryFn: async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index');
        
      if (categoriesError) throw categoriesError;
      
      // Get all skills
      const { data: skills, error: skillsError } = await supabase
        .from('technical_skills')
        .select('*')
        .order('order_index');
        
      if (skillsError) throw skillsError;
      
      // Map skills to categories
      const categoriesWithSkills = categories.map(category => ({
        ...category,
        skills: skills.filter(skill => skill.category_id === category.id)
      }));
      
      return categoriesWithSkills as SkillCategory[];
    }
  });
  
  const isLoading = loadingExpertise || loadingProjects || loadingSkills;

  // Fallback expertise items if none are available
  const fallbackExpertise = [
    {
      id: '1',
      title: 'Cinematic Storytelling',
      description: 'Bringing visuals to life with a unique creative approach.',
      icon: 'lucide-film',
      background_color: '#2A1E30',
      order_index: 1
    },
    {
      id: '2',
      title: 'Dynamic Camera Work',
      description: 'Capturing smooth, high-energy, and engaging shots.',
      icon: 'lucide-camera',
      background_color: '#2A1E30',
      order_index: 2
    },
    {
      id: '3',
      title: 'Expert Video Editing & Colour Grading',
      description: 'Ensuring every frame looks its best.',
      icon: 'lucide-scissors',
      background_color: '#2A1E30',
      order_index: 3
    }
  ];
  
  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-elvis-pink">My Expertise</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Delivering exceptional visual storytelling through my specialized skills and experience
          </p>
        </motion.div>
        
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 bg-[#151515] rounded-md overflow-hidden border border-elvis-light/20">
              <TabsTrigger 
                value="expertise" 
                className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white py-3 px-6"
              >
                Expertise
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white py-3 px-6"
              >
                Project Types
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white py-3 px-6"
              >
                Technical Skills
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="expertise">
              <ExpertiseTabContent 
                expertiseItems={expertiseItems?.length ? expertiseItems : fallbackExpertise} 
                isLoading={isLoading} 
              />
            </TabsContent>
            
            <TabsContent value="projects">
              <ProjectTypesTabContent 
                projectTypes={projectTypes} 
                isLoading={isLoading} 
              />
            </TabsContent>
            
            <TabsContent value="skills">
              <TechnicalSkillsTabContent 
                skillCategories={skillCategories} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
