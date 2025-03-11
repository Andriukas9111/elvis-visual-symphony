import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpertise, ExpertiseItem } from '@/hooks/api/useExpertise';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedExpertiseCard from './EnhancedExpertiseCard';
import EnhancedProjectCard from './EnhancedProjectCard';
import EnhancedTechnicalSkill from './EnhancedTechnicalSkill';
import DecoratedSectionHeader from './DecoratedSectionHeader';
import SocialMediaLinks from './SocialMediaLinks';
import TechnicalSkillsGrid from './TechnicalSkillsGrid';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';

interface EnhancedExpertiseContainerProps {
  isInView: boolean;
  items?: ExpertiseItem[];
}

const EnhancedExpertiseContainer: React.FC<EnhancedExpertiseContainerProps> = ({ isInView, items }) => {
  const { data: expertiseItems, isLoading: expertiseLoading } = useExpertise();
  const [activeTab, setActiveTab] = useState('expertise');
  const [tabHeight, setTabHeight] = useState<number | 'auto'>('auto');
  
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
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true
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

  // Measure the height of the tab content for smooth animation
  useEffect(() => {
    const updateHeight = () => {
      const tabContent = document.getElementById(`tab-content-${activeTab}`);
      if (tabContent) {
        setTabHeight(tabContent.offsetHeight);
      }
    };

    updateHeight();
    // Add a small delay to ensure content is fully rendered
    const timeout = setTimeout(updateHeight, 100);
    
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timeout);
    };
  }, [activeTab, expertiseData, projectData, technicalSkills]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl border border-white/10 animate-pulse">
        <div className="flex items-center mb-6">
          <span className="h-7 w-1.5 bg-elvis-pink/30 rounded-full mr-3"></span>
          <div className="h-8 w-40 bg-white/10 rounded"></div>
          <div className="ml-auto">
            <div className="h-8 w-40 bg-white/10 rounded-lg"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-white/10 rounded"></div>
          <div className="h-24 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <DecoratedSectionHeader 
        title="My Expertise" 
        subtitle="Delivering exceptional visual storytelling through my specialized skills and experience"
        isInView={isInView}
      />

      <div className="glass-card p-8 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="mb-8 bg-elvis-dark/50 border border-white/10 p-1">
            <TabsTrigger 
              value="expertise" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-elvis-pink/20 data-[state=active]:to-elvis-purple/20 data-[state=active]:border-elvis-pink/30 data-[state=active]:border text-lg py-2 px-4"
            >
              Expertise
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-elvis-pink/20 data-[state=active]:to-elvis-purple/20 data-[state=active]:border-elvis-pink/30 data-[state=active]:border text-lg py-2 px-4"
            >
              Project Types
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-elvis-pink/20 data-[state=active]:to-elvis-purple/20 data-[state=active]:border-elvis-pink/30 data-[state=active]:border text-lg py-2 px-4"
            >
              Technical Skills
            </TabsTrigger>
          </TabsList>
          
          <motion.div 
            style={{ height: tabHeight }} 
            className="transition-height duration-500 ease-in-out overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                id={`tab-content-${activeTab}`}
              >
                <TabsContent value="expertise" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {expertiseData.length > 0 ? (
                      expertiseData.map((expertise, index) => (
                        <EnhancedExpertiseCard 
                          key={expertise.id} 
                          title={expertise.label}
                          description={expertise.description}
                          expertise={expertise}
                          delay={index}
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 col-span-2">
                        <p className="text-white/60">No expertise data found. Add some in the admin panel.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projectData.length > 0 ? (
                      projectData.map((project, index) => (
                        <EnhancedProjectCard 
                          key={project.id}
                          title={project.label}
                          description={project.description}
                          project={project}
                          delay={index}
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 col-span-2">
                        <p className="text-white/60">No project type data found. Add some in the admin panel.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="mt-0">
                  <TechnicalSkillsGrid 
                    isInView={isInView}
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Tabs>
      </div>
      
      <SocialMediaLinks isInView={isInView} />
    </div>
  );
};

export default EnhancedExpertiseContainer;
