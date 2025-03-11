
import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/api/useSkills';
import SkillCard from '@/components/ui/about/SkillCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainer, fadeInUpVariant } from '@/types/about.types';

const SkillsSection: React.FC = () => {
  const { data: skills = [], isLoading } = useSkills();
  const [activeCategory, setActiveCategory] = React.useState('');
  
  // Get unique categories from skills
  const categories = React.useMemo(() => {
    if (skills.length === 0) return ['Videography', 'Editing', 'Technical'];
    
    const uniqueCategories = Array.from(
      new Set(skills.map(skill => skill.category))
    );
    
    return uniqueCategories;
  }, [skills]);
  
  // Set initial active category once categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);
  
  // Filter skills by active category
  const filteredSkills = React.useMemo(() => {
    if (!activeCategory) return [];
    
    return skills.filter(skill => skill.category === activeCategory);
  }, [skills, activeCategory]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-elvis-medium/20 h-10 w-48 rounded"></div>
        <div className="bg-elvis-medium/20 h-6 w-full rounded my-4"></div>
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-elvis-medium/20 rounded-full h-10 w-24"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-16"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <SectionHeading 
        title="Professional Skills" 
        subtitle="Technical proficiencies and expertise in videography and production"
        accent="teal"
      />
      
      <div className="glass-card p-8 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all">
        <Tabs 
          value={activeCategory || categories[0]} 
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="mb-8 bg-elvis-dark/50 border border-white/10 p-1 mx-auto flex justify-center">
            {categories.map(category => (
              <TabsTrigger 
                key={category}
                value={category} 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-elvis-pink/20 data-[state=active]:to-elvis-purple/20 data-[state=active]:border-elvis-pink/30 data-[state=active]:border text-lg py-2 px-4"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill, index) => (
                    <SkillCard 
                      key={skill.id} 
                      skill={skill}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 col-span-2">
                    <p className="text-white/60">No skills data found for this category.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SkillsSection;
