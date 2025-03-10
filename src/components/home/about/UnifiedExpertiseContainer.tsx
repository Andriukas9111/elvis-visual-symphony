
import React from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData } from './types';

interface UnifiedExpertiseContainerProps {
  isInView: boolean;
}

const UnifiedExpertiseContainer: React.FC<UnifiedExpertiseContainerProps> = ({ isInView }) => {
  const { data: expertiseItems, isLoading: expertiseLoading } = useExpertise();
  
  // Fetch technical skills separately
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

  // Add logging to help diagnose technical skills
  React.useEffect(() => {
    if (skillsLoading) {
      console.log('Loading technical skills...');
    } else if (technicalSkills) {
      console.log(`Successfully loaded ${technicalSkills.length} technical skill categories`);
    } else {
      console.log('No technical skills received from database');
    }
  }, [technicalSkills, skillsLoading]);

  const isLoading = expertiseLoading || skillsLoading;

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

  if (!expertiseItems || (expertiseData.length === 0 && projectData.length === 0)) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <h3 className="text-3xl font-bold">My Expertise</h3>
        </div>
      </div>

      <Tabs defaultValue="expertise" className="w-full">
        <TabsList className="mb-6 bg-elvis-dark/50 border border-white/10">
          <TabsTrigger value="expertise" className="data-[state=active]:bg-elvis-pink/20">Expertise</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-elvis-pink/20">Project Types</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-elvis-pink/20">Technical Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expertise" className="mt-0">
          <div className="space-y-4">
            {expertiseData.length > 0 ? (
              expertiseData.map((expertise, index) => (
                <motion.div
                  key={expertise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <ExpertiseCard expertise={expertise} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-white/60">No expertise data found. Add some in the admin panel.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-0">
          <div className="space-y-4">
            {projectData.length > 0 ? (
              projectData.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-white/60">No project type data found. Add some in the admin panel.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-0">
          <div className="space-y-6">
            {technicalSkills && technicalSkills.length > 0 ? (
              technicalSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-elvis-dark/50 rounded-lg p-4 border border-white/10"
                >
                  <h4 className="text-white text-lg font-medium mb-3">{skill.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.skills && skill.skills.map((item, idx) => (
                      <span 
                        key={idx} 
                        className="bg-elvis-pink/10 text-white/90 px-3 py-1 rounded-full text-sm border border-elvis-pink/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-white/60">No technical skills found. Add some in the admin panel.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedExpertiseContainer;
