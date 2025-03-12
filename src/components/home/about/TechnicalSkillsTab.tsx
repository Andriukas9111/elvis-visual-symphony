
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';
import { 
  Palette, 
  Camera, 
  Video, 
  Film, 
  PenTool, 
  Layers, 
  Scissors, 
  MonitorSmartphone,
  Laptop,
  FileVideo,
  Image,
  Sliders,
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
      'Color Grading': <Sliders className="h-4 w-4" />,
      'Aerial Videography': <FileVideo className="h-4 w-4" />,
      
      // Software
      'Adobe Photoshop': <Layers className="h-4 w-4" />,
      'Adobe Premiere Pro': <Video className="h-4 w-4" />,
      'Adobe Lightroom': <FileImage className="h-4 w-4" />,
      'Final Cut Pro': <Scissors className="h-4 w-4" />,
      'DaVinci Resolve': <PenTool className="h-4 w-4" />
    };
    
    return iconMap[skillName] || <Palette className="h-4 w-4" />;
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
        return <Palette className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {technicalSkills.map((category, categoryIndex) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
          className="bg-elvis-dark/80 p-4 rounded-lg border border-white/5"
        >
          <div className="bg-elvis-purple/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
            {getCategoryIcon(category.category)}
          </div>
          <h4 className="text-white text-lg font-semibold mb-2">{category.category}</h4>
          <div className="space-y-2">
            {category.skills?.map((skill, index) => (
              <div
                key={`${category.id}-${index}`}
                className="bg-elvis-medium/40 rounded-md p-2 flex items-center gap-2"
              >
                <div className="bg-elvis-pink/10 p-1.5 rounded">
                  {getSkillIcon(skill)}
                </div>
                <span className="text-sm text-white/90">{skill}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TechnicalSkillsTab;
