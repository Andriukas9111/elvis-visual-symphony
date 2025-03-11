
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database as DatabaseIcon, Code, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData, ExpertiseData } from './types';
import { getIconByName } from '../admin/about/stats/IconSelector';
import EnhancedExpertiseCard from './EnhancedExpertiseCard';
import EnhancedProjectCard from './EnhancedProjectCard';
import EnhancedTechnicalSkill from './EnhancedTechnicalSkill';
import SocialMediaLinks from './SocialMediaLinks';

interface ExpertiseContainerProps {
  isInView?: boolean;
}

const EnhancedExpertiseContainer: React.FC<ExpertiseContainerProps> = ({ isInView = false }) => {
  const [activeTab, setActiveTab] = useState('expertise');
  
  // Fetch expertise data from Supabase
  const { data: expertiseData } = useQuery({
    queryKey: ['expertise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as ExpertiseData[];
    }
  });

  // Fetch technical skills data from Supabase
  const { data: technicalSkills } = useQuery({
    queryKey: ['technical-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('category', { ascending: true });
        
      if (error) throw error;
      return data as TechnicalSkillData[];
    }
  });

  const renderIconComponent = (iconName: string | undefined) => {
    if (!iconName) return null;
    const IconComponent = getIconByName(iconName);
    return <IconComponent className="h-5 w-5" />;
  };

  const expertiseItems = expertiseData?.filter(item => item.type === 'expertise') || [];
  const projectItems = expertiseData?.filter(item => item.type === 'project') || [];

  return (
    <div className="mt-8">
      <Tabs defaultValue="expertise" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="expertise" className="flex items-center gap-2">
            <DatabaseIcon className="h-4 w-4" />
            <span>Expertise</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Technical Skills</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expertise" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertiseItems.map(expertise => (
              <EnhancedExpertiseCard
                key={expertise.id}
                title={expertise.label}
                description={expertise.description}
                icon={expertise.icon || renderIconComponent(expertise.icon_name)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectItems.map(project => (
              <EnhancedProjectCard
                key={project.id}
                title={project.label}
                description={project.description}
                icon={project.icon || renderIconComponent(project.icon_name)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {technicalSkills && technicalSkills.map(skillCategory => (
              <EnhancedTechnicalSkill key={skillCategory.id} skill={skillCategory} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <SocialMediaLinks isInView={isInView} />
      </div>
    </div>
  );
};

export default EnhancedExpertiseContainer;
