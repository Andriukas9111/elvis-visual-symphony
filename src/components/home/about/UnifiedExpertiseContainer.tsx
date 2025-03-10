
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { skills, projectsData, tabsData, technicalSkills } from './data';
import Card3D from '../../hire-me/Card3D';

interface UnifiedExpertiseContainerProps {
  isInView: boolean;
}

const UnifiedExpertiseContainer = ({ isInView }: UnifiedExpertiseContainerProps) => {
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

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const renderTechnicalSkills = () => (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {technicalSkills.map((category) => (
        <motion.div 
          key={category.id}
          variants={itemVariants} 
          className="glass-card p-6 border border-white/10 hover:border-elvis-pink/30 transition-all relative overflow-hidden"
        >
          <h4 className="text-xl font-bold mb-4 text-white">{category.category}</h4>
          <ul className="space-y-2">
            {category.skills.map((skill, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-elvis-pink mr-2"></span>
                <span className="text-white/80">{skill}</span>
              </motion.li>
            ))}
          </ul>
          <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-elvis-pink/5 rounded-full blur-xl"></div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderExpertise = () => (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {skills.map((skill) => (
        <motion.div
          key={skill.id}
          variants={itemVariants}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <Card3D>
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 bg-elvis-medium/80 w-16 h-16 rounded-full flex items-center justify-center shadow-pink-glow">
                <motion.div 
                  className="text-elvis-pink"
                  whileHover={{ rotate: 5 }}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(255, 0, 255, 0.3)', '0 0 20px rgba(255, 0, 255, 0.6)', '0 0 0 rgba(255, 0, 255, 0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {skill.icon}
                </motion.div>
              </div>
              <h3 className="font-bold text-xl mb-2">{skill.label}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{skill.description}</p>
            </div>
          </Card3D>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderProjects = () => (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {projectsData.map((project) => (
        <motion.div
          key={project.id}
          variants={itemVariants}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <Card3D>
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 bg-elvis-medium/80 w-16 h-16 rounded-full flex items-center justify-center shadow-pink-glow">
                <motion.div 
                  className="text-elvis-pink"
                  whileHover={{ rotate: 5 }}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(255, 0, 255, 0.3)', '0 0 20px rgba(255, 0, 255, 0.6)', '0 0 0 rgba(255, 0, 255, 0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {project.icon}
                </motion.div>
              </div>
              <h3 className="font-bold text-xl mb-2">{project.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{project.description}</p>
              
              <div className="mt-auto flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  <span className="text-white/80">{project.stats.completed} Completed</span>
                </div>
                {project.stats.inProgress > 0 && (
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                    <span className="text-white/80">{project.stats.inProgress} In Progress</span>
                  </div>
                )}
              </div>
            </div>
          </Card3D>
        </motion.div>
      ))}
    </motion.div>
  );

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
          {tabsData.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className="flex-1 py-3 data-[state=active]:bg-elvis-gradient data-[state=active]:text-white data-[state=active]:shadow-pink-glow"
            >
              <div className="flex items-center justify-center">
                {tab.icon}
                <span>{tab.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent 
            value="expertise" 
            className={`mt-0 ${activeTab === "expertise" ? "block" : "hidden"}`}
          >
            {renderExpertise()}
          </TabsContent>
          
          <TabsContent 
            value="projects" 
            className={`mt-0 ${activeTab === "projects" ? "block" : "hidden"}`}
          >
            {renderProjects()}
          </TabsContent>
          
          <TabsContent 
            value="technical" 
            className={`mt-0 ${activeTab === "technical" ? "block" : "hidden"}`}
          >
            {renderTechnicalSkills()}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default UnifiedExpertiseContainer;
