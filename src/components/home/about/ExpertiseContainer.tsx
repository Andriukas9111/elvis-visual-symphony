
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import { expertiseData, projectsData } from './expertiseData';
import { TabData } from './types';

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

interface ExpertiseContainerProps {
  isInView: boolean;
}

const ExpertiseContainer: React.FC<ExpertiseContainerProps> = ({ isInView }) => {
  const [activeTab, setActiveTab] = useState<string>("expertise");

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
              {expertiseData.map((expertise, index) => (
                <ExpertiseCard
                  key={expertise.id}
                  expertise={expertise}
                />
              ))}
            </div>
          )}
          
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsData.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
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
