
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from '../SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpertiseTabContent from './ExpertiseTabContent';
import ProjectTypesTabContent from './ProjectTypesTabContent';
import TechnicalSkillsTabContent from './TechnicalSkillsTabContent';

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
  
  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container max-w-7xl mx-auto px-4">
        <SectionHeading title="My Expertise" subtitle="Delivering exceptional visual storytelling through my specialized skills and experience" />
        
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 bg-elvis-medium">
              <TabsTrigger value="expertise" className="data-[state=active]:bg-elvis-pink">Expertise</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-elvis-pink">Project Types</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-elvis-pink">Technical Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expertise">
              <ExpertiseTabContent 
                expertiseItems={expertiseItems} 
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
