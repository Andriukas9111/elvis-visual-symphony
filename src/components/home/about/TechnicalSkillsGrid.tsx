
import React from 'react';
import { TechnicalSkillData } from './types';
import EnhancedTechnicalSkill from './EnhancedTechnicalSkill';

interface TechnicalSkillsGridProps {
  isInView: boolean;
}

const TechnicalSkillsGrid: React.FC<TechnicalSkillsGridProps> = ({ 
  isInView
}) => {
  // Mock technical skills data - in a real application you would fetch this from an API
  const technicalSkills: TechnicalSkillData[] = [
    {
      id: '1',
      category: 'Photography',
      skills: ['Portrait Photography', 'Landscape Photography', 'Studio Lighting', 'Photo Editing']
    },
    {
      id: '2',
      category: 'Videography',
      skills: ['Cinematic Filming', 'Video Editing', 'Color Grading', 'Aerial Videography']
    },
    {
      id: '3',
      category: 'Software',
      skills: ['Adobe Photoshop', 'Adobe Premiere Pro', 'Adobe Lightroom', 'Final Cut Pro', 'DaVinci Resolve']
    }
  ];
  
  // Group skills by category if not already grouped
  const groupedSkills = React.useMemo(() => {
    // If skills are already grouped by category (each item has a skills array)
    if (technicalSkills.length > 0 && technicalSkills[0].skills) {
      return technicalSkills.reduce((groups: Record<string, TechnicalSkillData>, skill) => {
        if (!groups[skill.category]) {
          groups[skill.category] = skill;
        }
        return groups;
      }, {});
    }
    
    // If skills are flat (each item is an individual skill)
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
      {Object.entries(groupedSkills).map(([category, skills], categoryIndex) => {
        // Handle both grouped and ungrouped data structures
        if (Array.isArray(skills)) {
          // For flat skills structure
          return (
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
          );
        } else {
          // For grouped skills structure (skill has skills array)
          const skillItem = skills as TechnicalSkillData;
          return (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-bold text-white">{category}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <EnhancedTechnicalSkill 
                  key={skillItem.id} 
                  skill={skillItem}
                  delay={categoryIndex}
                />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default TechnicalSkillsGrid;
