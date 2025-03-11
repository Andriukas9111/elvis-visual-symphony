
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import { useExpertise } from '@/hooks/api/useExpertise';

interface ExpertiseContainerProps {
  isInView: boolean;
}

const ExpertiseContainer: React.FC<ExpertiseContainerProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState<string>("expertise");
  
  const { data: expertiseItems = [], isLoading } = useExpertise();
  
  // Filter items by type
  const expertiseData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'expertise');
  }, [expertiseItems]);
  
  const projectItems = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'project');
  }, [expertiseItems]);

  // Define tab data
  const tabsData = [
    {
      id: "expertise",
      title: "Expertise",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expertiseData.map((item) => (
            <ExpertiseCard key={item.id} expertise={item} />
          ))}
        </div>
      )
    },
    {
      id: "projects",
      title: "Projects",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectItems.map((item) => (
            <ProjectCard key={item.id} project={item} />
          ))}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex space-x-2 mb-6">
          {tabsData.map((tab) => (
            <div 
              key={tab.id}
              className="h-10 w-28 bg-white/10 rounded-md"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/10 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex space-x-2 mb-6">
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-elvis-pink/20 text-white'
                : 'bg-transparent text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.title}</span>
          </button>
        ))}
      </div>
      
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {tabsData.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExpertiseContainer;
