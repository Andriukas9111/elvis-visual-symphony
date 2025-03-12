
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useExpertise } from '@/hooks/api/useExpertise';
import TechnicalSkillsTab from './TechnicalSkillsTab';
import { Film, Briefcase, Wrench } from 'lucide-react';

interface ExpertiseTabsProps {
  isInView: boolean;
}

const ExpertiseTabs: React.FC<ExpertiseTabsProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState('expertise');
  const { data: expertiseData, isLoading } = useExpertise();

  // Filter data by type
  const expertiseItems = expertiseData?.filter(item => item.type === 'expertise') || [];
  const projectItems = expertiseData?.filter(item => item.type === 'project') || [];

  // Default items if none found in database
  const defaultExpertise = [
    {
      id: '1',
      type: 'expertise',
      icon_name: 'Film',
      label: 'Cinematic Storytelling',
      description: 'Bringing visuals to life with a unique creative approach.'
    },
    {
      id: '2',
      type: 'expertise',
      icon_name: 'Camera',
      label: 'Dynamic Camera Work',
      description: 'Capturing smooth, high-energy, and engaging shots.'
    },
    {
      id: '3',
      type: 'expertise',
      icon_name: 'Edit',
      label: 'Expert Video Editing & Colour Grading',
      description: 'Ensuring every frame looks its best.'
    }
  ];

  // Get icon based on name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Film':
        return <Film className="h-6 w-6" />;
      case 'Camera':
        return <Film className="h-6 w-6" />;
      case 'Edit':
        return <Film className="h-6 w-6" />;
      default:
        return <Film className="h-6 w-6" />;
    }
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl font-bold mb-3">My Expertise</h3>
        <p className="text-white/70 max-w-2xl mx-auto">
          Delivering exceptional visual storytelling through my specialized skills and experience
        </p>
      </motion.div>
      
      <div className="bg-elvis-medium/20 backdrop-blur-sm rounded-xl p-6 border border-white/5">
        <Tabs defaultValue="expertise" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="expertise" className="data-[state=active]:bg-elvis-pink">
              <div className="flex items-center">
                <Film className="mr-2 h-4 w-4" />
                <span>Expertise</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-elvis-pink">
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Project Types</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-elvis-pink">
              <div className="flex items-center">
                <Wrench className="mr-2 h-4 w-4" />
                <span>Technical Skills</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="expertise" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(expertiseItems.length > 0 ? expertiseItems : defaultExpertise).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-elvis-dark/80 p-4 rounded-lg border border-white/5"
                >
                  <div className="bg-elvis-pink/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                    {getIcon(item.icon_name)}
                  </div>
                  <h4 className="text-white text-lg font-semibold mb-2">{item.label}</h4>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectItems.length > 0 ? (
                projectItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-elvis-dark/80 p-4 rounded-lg border border-white/5"
                  >
                    <div className="bg-elvis-purple/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                      {getIcon(item.icon_name)}
                    </div>
                    <h4 className="text-white text-lg font-semibold mb-2">{item.label}</h4>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-white/50">
                  No project types found. Add some in the admin panel.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-2">
            <TechnicalSkillsTab isInView={isInView && activeTab === 'skills'} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpertiseTabs;
