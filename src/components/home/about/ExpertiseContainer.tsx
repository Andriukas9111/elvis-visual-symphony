
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import { TabData } from './types';
import { useExpertise } from '@/hooks/api/useExpertise';

// Define tab data
const tabsData: TabData[] = [
  {
    id: "expertise",
    title: "Expertise",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  },
  {
    id: "projects",
    title: "Projects",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
  }
];

// Helper function to get icon from name
const getIconFromName = (iconName: string) => {
  const icons: Record<string, JSX.Element> = {
    Camera: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
    Video: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    Film: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
    Award: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    Users: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Edit: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    Code: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  };
  
  return icons[iconName] || icons.Camera;
};

interface ExpertiseContainerProps {
  isInView: boolean;
}

const ExpertiseContainer: React.FC<ExpertiseContainerProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState<string>("expertise");
  
  const { data: expertiseItems = [], isLoading: expertiseLoading } = useExpertise('expertise');
  const { data: projectItems = [], isLoading: projectsLoading } = useExpertise('project');

  // Transform database items to component props
  const mappedExpertiseItems = expertiseItems.map(item => ({
    id: item.id,
    icon: getIconFromName(item.icon_name),
    label: item.label,
    description: item.description
  }));

  const mappedProjectItems = projectItems.map(item => ({
    id: item.id,
    icon: getIconFromName(item.icon_name),
    title: item.label,
    description: item.description
  }));

  if (expertiseLoading && projectsLoading) {
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
            {tab.icon}
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
          {activeTab === "expertise" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mappedExpertiseItems.map((item) => (
                <ExpertiseCard
                  key={item.id}
                  expertise={item}
                />
              ))}
            </div>
          )}
          
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mappedProjectItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  project={item}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExpertiseContainer;
