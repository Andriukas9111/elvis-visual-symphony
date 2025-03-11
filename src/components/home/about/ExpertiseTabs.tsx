
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ExpertiseGrid from './ExpertiseGrid';
import ProjectTypesGrid from './ProjectTypesGrid';
import TechnicalSkillsGrid from './TechnicalSkillsGrid';

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ExpertiseTabs = () => {
  const [activeTab, setActiveTab] = useState('expertise');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="container mx-auto px-4 py-16" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">What I Do</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Specializing in premium content creation and digital services
        </p>
      </motion.div>

      <Tabs
        defaultValue="expertise"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto mb-8">
          {['expertise', 'projectTypes', 'technicalSkills'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="py-3 text-sm md:text-base data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              {tab === 'expertise' && 'Expertise'}
              {tab === 'projectTypes' && 'Project Types'}
              {tab === 'technicalSkills' && 'Technical Skills'}
            </TabsTrigger>
          ))}
        </TabsList>

        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={tabVariants}
          transition={{ duration: 0.5 }}
        >
          <TabsContent value="expertise" className="mt-0">
            <ExpertiseGrid />
          </TabsContent>

          <TabsContent value="projectTypes" className="mt-0">
            <ProjectTypesGrid />
          </TabsContent>

          <TabsContent value="technicalSkills" className="mt-0">
            <TechnicalSkillsGrid />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default ExpertiseTabs;
