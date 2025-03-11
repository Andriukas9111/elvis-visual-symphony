
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from 'lucide-react';

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

interface ProjectType {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

interface TechnicalSkill {
  id: string;
  name: string;
  proficiency: number;
  category_id: string;
  order_index: number;
}

interface SkillCategory {
  id: string;
  name: string;
  order_index: number;
  // Add the optional icon property to fix the TypeScript error
  icon?: string;
  skills?: TechnicalSkill[];
}

const ExpertiseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("expertise");
  
  const { data: expertiseItems, isLoading: loadingExpertise } = useQuery({
    queryKey: ['expertise_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise_items')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ExpertiseItem[];
    }
  });
  
  const { data: projectTypes, isLoading: loadingProjects } = useQuery({
    queryKey: ['project_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_types')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as ProjectType[];
    }
  });
  
  const { data: skillCategories, isLoading: loadingSkills } = useQuery({
    queryKey: ['skill_categories'],
    queryFn: async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index');
        
      if (categoriesError) throw categoriesError;
      
      // Get all skills
      const { data: skills, error: skillsError } = await supabase
        .from('technical_skills')
        .select('*')
        .order('order_index');
        
      if (skillsError) throw skillsError;
      
      // Map skills to categories
      const categoriesWithSkills = categories.map(category => ({
        ...category,
        skills: skills.filter(skill => skill.category_id === category.id)
      }));
      
      return categoriesWithSkills as SkillCategory[];
    }
  });
  
  // Function to render icons from Lucide
  const renderIcon = (iconName: string) => {
    if (iconName.startsWith('lucide-')) {
      const iconKey = iconName.replace('lucide-', '');
      // Convert kebab-case to PascalCase for Lucide icons
      const pascalCaseIcon = iconKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      const Icon = (LucideIcons as any)[pascalCaseIcon];
      
      if (Icon) {
        return <Icon size={24} />;
      }
    }
    
    // Fallback to class-based icon (for Font Awesome, etc.)
    return <i className={iconName}></i>;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const isLoading = loadingExpertise || loadingProjects || loadingSkills;
  
  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container max-w-7xl mx-auto px-4">
        <SectionHeading title="My Expertise" subtitle="Delivering exceptional visual storytelling through my specialized skills and experience" />
        
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 bg-elvis-medium">
              <TabsTrigger value="expertise" className="data-[state=active]:bg-elvis-pink">Expertise</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-elvis-pink">Project Types</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-elvis-pink">Technical Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expertise">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-elvis-medium rounded-xl h-64 animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {expertiseItems?.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-elvis-medium rounded-xl p-6 hover:bg-elvis-light transition-colors hover:shadow-pink-glow"
                      variants={itemVariants}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-elvis-pink flex items-center justify-center mr-4">
                          {renderIcon(item.icon)}
                        </div>
                        <h3 className="font-bold text-xl">{item.title}</h3>
                      </div>
                      <p className="text-white/70">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="projects">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-elvis-medium rounded-xl h-64 animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {projectTypes?.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-elvis-medium rounded-xl p-6 hover:bg-elvis-light transition-colors hover:shadow-pink-glow"
                      variants={itemVariants}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-elvis-pink flex items-center justify-center mr-4">
                          {renderIcon(item.icon)}
                        </div>
                        <h3 className="font-bold text-xl">{item.title}</h3>
                      </div>
                      <p className="text-white/70">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="skills">
              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-8 w-48 bg-elvis-medium rounded mb-4"></div>
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j} className="h-6 bg-elvis-medium rounded"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="space-y-12"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {skillCategories?.map((category) => (
                    <motion.div key={category.id} className="bg-elvis-medium rounded-xl p-6" variants={itemVariants}>
                      <h3 className="font-bold text-xl mb-6 flex items-center">
                        {/* Add a conditional check to see if category.icon exists before trying to render it */}
                        {category.icon && (
                          <div className="w-10 h-10 rounded-full bg-elvis-pink flex items-center justify-center mr-3">
                            {renderIcon(category.icon)}
                          </div>
                        )}
                        {category.name}
                      </h3>
                      <div className="space-y-6">
                        {category.skills?.map((skill) => (
                          <div key={skill.id} className="space-y-2">
                            <div className="flex justify-between">
                              <span>{skill.name}</span>
                              <span>{skill.proficiency}%</span>
                            </div>
                            <div className="h-2 w-full bg-elvis-dark rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-elvis-pink rounded-full" 
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
