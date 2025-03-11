
import React, { useState } from 'react';
import { useExpertise } from '@/hooks/api/useExpertise';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData, TabData } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import EnhancedTechnicalSkill from './EnhancedTechnicalSkill';
import SocialMediaLinks from './SocialMediaLinks';

const ExpertiseContainer = () => {
  const [activeTab, setActiveTab] = useState('expertise');
  
  // Use the correct hook call without arguments
  const { data: expertiseItems, isLoading: expertiseLoading } = useExpertise();
  
  // Fetch technical skills
  const { data: technicalSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ['technicalSkills'],
    queryFn: async () => {
      console.log('Fetching technical skills from database');
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('category', { ascending: true });
        
      if (error) {
        console.error('Error fetching technical skills:', error);
        throw error;
      }
      
      console.log('Technical skills fetched:', data);
      return data as TechnicalSkillData[];
    }
  });
  
  const expertiseData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'expertise');
  }, [expertiseItems]);
  
  const projectData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'project');
  }, [expertiseItems]);

  const isLoading = expertiseLoading || skillsLoading;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-24 bg-gray-300 rounded"></div>
        <div className="h-24 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expertise" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expertiseData && expertiseData.map(expertise => (
              <ExpertiseCard key={expertise.id} expertise={expertise} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectData && projectData.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {technicalSkills && technicalSkills.map(skillCategory => (
              <EnhancedTechnicalSkill key={skillCategory.id} skillData={skillCategory} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default ExpertiseContainer;
