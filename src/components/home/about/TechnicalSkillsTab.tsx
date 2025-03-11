
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';
import { 
  Brush, 
  Camera, 
  Video, 
  Film, 
  Pencil, 
  Layers, 
  Scissors, 
  MonitorSmartphone,
  Laptop,
  PenTool,
  FileVideo,
  Image,
  PaintBucket,
  FileImage,
  Wand2
} from 'lucide-react';

interface TechnicalSkillsTabProps {
  isInView: boolean;
}

const TechnicalSkillsTab: React.FC<TechnicalSkillsTabProps> = ({ 
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
  
  // Map skill names to appropriate icons
  const getSkillIcon = (skillName: string) => {
    const iconMap: {[key: string]: React.ReactNode} = {
      // Photography
      'Portrait Photography': <Camera className="h-4 w-4" />,
      'Landscape Photography': <Image className="h-4 w-4" />,
      'Studio Lighting': <Wand2 className="h-4 w-4" />,
      'Photo Editing': <PenTool className="h-4 w-4" />,
      
      // Videography
      'Cinematic Filming': <Film className="h-4 w-4" />,
      'Video Editing': <Scissors className="h-4 w-4" />,
      'Color Grading': <PaintBucket className="h-4 w-4" />,
      'Aerial Videography': <FileVideo className="h-4 w-4" />,
      
      // Software
      'Adobe Photoshop': <Layers className="h-4 w-4" />,
      'Adobe Premiere Pro': <Video className="h-4 w-4" />,
      'Adobe Lightroom': <FileImage className="h-4 w-4" />,
      'Final Cut Pro': <Scissors className="h-4 w-4" />,
      'DaVinci Resolve': <PenTool className="h-4 w-4" />
    };
    
    return iconMap[skillName] || <Brush className="h-4 w-4" />;
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Photography':
        return <Camera className="h-5 w-5" />;
      case 'Videography':
        return <Video className="h-5 w-5" />;
      case 'Software':
        return <Laptop className="h-5 w-5" />;
      default:
        return <Brush className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-8">
      {technicalSkills.map((skill, categoryIndex) => (
        <div key={skill.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-elvis-pink/20 p-2 rounded-lg">
              {getCategoryIcon(skill.category)}
            </div>
            <h3 className="text-xl font-bold text-white">{skill.category}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skill.skills?.map((skillItem, index) => (
              <motion.div
                key={`${skill.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: (categoryIndex * 0.2) + (index * 0.05) }}
                className="bg-elvis-dark/80 border border-white/10 rounded-lg p-3 flex items-center gap-2"
              >
                <div className="bg-elvis-pink/10 p-1.5 rounded">
                  {getSkillIcon(skillItem)}
                </div>
                <span className="text-sm text-white/90">{skillItem}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicalSkillsTab;
