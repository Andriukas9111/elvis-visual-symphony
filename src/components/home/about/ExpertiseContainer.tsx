
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExpertiseData, ProjectData, TabData, TechnicalSkillData } from './types';
import { expertiseData, projectsData, tabsData, technicalSkillsData } from './expertiseData';
import ExpertiseCard from './ExpertiseCard';
import ProjectCard from './ProjectCard';
import TechnicalSkillCard from './TechnicalSkillCard';

interface ExpertiseContainerProps {
  isInView: boolean;
}

const ExpertiseContainer = ({ isInView }: ExpertiseContainerProps) => {
  const [activeTab, setActiveTab] = useState("expertise");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="w-full"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full flex mb-10 bg-elvis-medium/20 p-1 rounded-lg border border-white/5 backdrop-blur-lg">
          {tabsData.map((tab: TabData) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className="flex-1 py-3 data-[state=active]:bg-elvis-gradient data-[state=active]:text-white data-[state=active]:shadow-pink-glow"
            >
              <div className="flex items-center justify-center">
                {tab.icon}
                <span className="ml-2">{tab.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent 
            value="expertise" 
            className={`mt-0 ${activeTab === "expertise" ? "block" : "hidden"}`}
          >
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {expertiseData.map((expertise: ExpertiseData) => (
                <ExpertiseCard key={expertise.id} expertise={expertise} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent 
            value="projects" 
            className={`mt-0 ${activeTab === "projects" ? "block" : "hidden"}`}
          >
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {projectsData.map((project: ProjectData) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent 
            value="technical" 
            className={`mt-0 ${activeTab === "technical" ? "block" : "hidden"}`}
          >
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {technicalSkillsData.map((category: TechnicalSkillData) => (
                <TechnicalSkillCard key={category.id} category={category} />
              ))}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default ExpertiseContainer;
