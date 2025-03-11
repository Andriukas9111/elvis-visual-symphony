
import React from 'react';
import { TechnicalSkillData } from './types';
import EnhancedTechnicalSkill from './EnhancedTechnicalSkill';

interface TechnicalSkillsGridProps {
  technicalSkills: TechnicalSkillData[];
  isInView: boolean;
}

const TechnicalSkillsGrid: React.FC<TechnicalSkillsGridProps> = ({ 
  technicalSkills,
  isInView
}) => {
  // Group skills by category
  const groupedSkills = React.useMemo(() => {
    const groups: Record<string, TechnicalSkillData[]> = {};
    
    technicalSkills.forEach(skill => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    });
    
    return groups;
  }, [technicalSkills]);
  
  if (technicalSkills.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-white/60">No technical skills data found. Add some in the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills).map(([category, skills], categoryIndex) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-bold text-white">{category}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <EnhancedTechnicalSkill 
                key={skill.id} 
                skill={skill}
                delay={categoryIndex * 5 + index}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicalSkillsGrid;
