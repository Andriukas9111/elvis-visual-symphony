
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabData, TechnicalSkillData } from './types';
import TechnicalSkillCard from './TechnicalSkillCard';
import { useTechnicalSkills } from '@/hooks/api/useTechnicalSkills';

const mockSkills: TechnicalSkillData[] = [
  {
    id: "1",
    name: "Frontend Development",
    category: "Frontend Development",
    proficiency: 92,
    skills: [
      "React", "Next.js", "Vue", "TypeScript", "Tailwind CSS", "CSS/SCSS", "JavaScript", "HTML5"
    ],
    sort_order: 1
  },
  {
    id: "2",
    name: "Backend Development",
    category: "Backend Development",
    proficiency: 85,
    skills: [
      "Node.js", "Express", "NestJS", "Python", "Django", "REST API", "GraphQL", "PostgreSQL"
    ],
    sort_order: 2
  },
  {
    id: "3",
    name: "Design & UX",
    category: "Design & UX",
    proficiency: 88,
    skills: [
      "Figma", "Adobe XD", "Adobe Photoshop", "Wireframing", "Prototyping", "User Testing"
    ],
    sort_order: 3
  }
];

// Custom category type for tab filtering
interface CategoryTab {
  id: string;
  name: string;
}

const TechnicalSkillsTab: React.FC = () => {
  // Use the hook but fallback to mockSkills if data is not available
  const { data: apiSkills, isLoading } = useTechnicalSkills();
  const skills = apiSkills && apiSkills.length > 0 ? apiSkills : mockSkills;
  
  // Extract unique categories
  const categories: CategoryTab[] = [];
  const addedCategories = new Set<string>();
  
  skills.forEach((skill) => {
    if (!addedCategories.has(skill.category)) {
      categories.push({
        id: skill.id,
        name: skill.category
      });
      addedCategories.add(skill.category);
    }
  });
  
  // Add "All" category
  categories.unshift({ id: "all", name: "All Skills" });
  
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Filter skills based on active category
  const filteredSkills = activeCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);
  
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Technical Skills</h2>
      
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.name)}
            className={`px-6 py-2 rounded-full transition-all ${
              activeCategory === category.name
                ? "bg-elvis-gradient text-white"
                : "bg-elvis-dark-tertiary text-elvis-light hover:bg-elvis-dark-secondary"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Skills grid with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TechnicalSkillCard data={skill} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TechnicalSkillsTab;
