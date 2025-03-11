
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Code, PenTool, Database, Server, Smartphone, Cloud } from 'lucide-react';
import { TechnicalSkillData } from './types';
import TechnicalSkillCard from './TechnicalSkillCard';

const TechnicalSkillsTab = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Mock data for technical skills with appropriate types
  const technicalSkills: TechnicalSkillData[] = [
    {
      id: '1',
      name: 'Frontend Development',
      category: 'Development',
      proficiency: 90,
      icon_name: 'Code',
      color: '#61DAFB',
      skills: ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'JavaScript', 'TypeScript']
    },
    {
      id: '2',
      name: 'Mobile Development',
      category: 'Development',
      proficiency: 85,
      icon_name: 'Smartphone',
      color: '#3DDC84',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin']
    },
    {
      id: '3',
      name: 'UI/UX Design',
      category: 'Design',
      proficiency: 88,
      icon_name: 'Palette',
      color: '#FF7262',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Prototyping']
    }
  ];
  
  // Get unique categories
  const categories = ['all', ...new Set(technicalSkills.map(skill => skill.category))];
  
  // Filter skills by category
  const filteredSkills = activeCategory === 'all' 
    ? technicalSkills 
    : technicalSkills.filter(skill => skill.category === activeCategory);
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };
  
  // Method to render the appropriate icon for each category
  const renderCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'development':
        return <Code className="mr-2 h-4 w-4" />;
      case 'design':
        return <PenTool className="mr-2 h-4 w-4" />;
      case 'database':
        return <Database className="mr-2 h-4 w-4" />;
      case 'backend':
        return <Server className="mr-2 h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="mr-2 h-4 w-4" />;
      case 'cloud':
        return <Cloud className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="flex items-center">
              {category !== 'all' && renderCategoryIcon(category)}
              <span className="capitalize">{category}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeCategory} // Re-run animation when category changes
          >
            {filteredSkills.map((skill) => (
              <motion.div key={skill.id} variants={itemVariants}>
                <TechnicalSkillCard skill={skill} />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalSkillsTab;
