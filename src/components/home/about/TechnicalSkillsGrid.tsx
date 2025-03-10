
import React from 'react';
import { motion } from 'framer-motion';
import { TechnicalSkillData } from './types';
import { Aperture, Film, Camera, VideoIcon, Monitor, Crop, FileImage, Edit3, Maximize2, Grid, Settings, Terminal, Code, Layout } from 'lucide-react';

interface TechnicalSkillsGridProps {
  technicalSkills: TechnicalSkillData[];
  isInView: boolean;
}

const TechnicalSkillsGrid: React.FC<TechnicalSkillsGridProps> = ({ technicalSkills, isInView }) => {
  // Software icon mapping
  const softwareIcons: Record<string, JSX.Element> = {
    // Adobe products
    "Adobe Premiere Pro": <Film className="h-5 w-5 text-blue-400" />,
    "Adobe After Effects": <Motion className="h-5 w-5 text-purple-400" />,
    "Adobe Photoshop": <FileImage className="h-5 w-5 text-blue-500" />,
    "Adobe Lightroom": <Edit3 className="h-5 w-5 text-blue-300" />,
    "Adobe Illustrator": <Crop className="h-5 w-5 text-orange-400" />,
    "Final Cut Pro": <VideoIcon className="h-5 w-5 text-red-400" />,
    "DaVinci Resolve": <Edit3 className="h-5 w-5 text-pink-400" />,
    "Cinema 4D": <Maximize2 className="h-5 w-5 text-blue-300" />,
    "Blender": <Grid className="h-5 w-5 text-orange-300" />,
    "Avid Media Composer": <Film className="h-5 w-5 text-green-400" />,
    "Logic Pro": <Settings className="h-5 w-5 text-gray-300" />,
    "Unreal Engine": <Terminal className="h-5 w-5 text-green-500" />,
    "Unity": <Code className="h-5 w-5 text-blue-300" />,
    "Canon EOS": <Camera className="h-5 w-5 text-red-500" />,
    "Sony Alpha": <Camera className="h-5 w-5 text-blue-500" />,
    "Black Magic": <VideoIcon className="h-5 w-5 text-purple-400" />,
    "RED": <Aperture className="h-5 w-5 text-red-600" />,
    "DJI": <Monitor className="h-5 w-5 text-gray-400" />,
    "Capture One": <Layout className="h-5 w-5 text-blue-400" />,
    // Default
    "default": <Settings className="h-5 w-5 text-elvis-pink" />
  };

  const getSkillIcon = (skillName: string): JSX.Element => {
    // Check for exact matches
    if (softwareIcons[skillName]) {
      return softwareIcons[skillName];
    }
    
    // Check for partial matches
    for (const [key, icon] of Object.entries(softwareIcons)) {
      if (skillName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    // Default icon
    return softwareIcons.default;
  };

  const generateSkillLevel = (index: number): number => {
    // Assume higher index = higher skill level (80-100%)
    const baseLevel = 70;
    const maxAddition = 30;
    const random = Math.floor(Math.random() * maxAddition);
    return baseLevel + random;
  };

  if (!technicalSkills || technicalSkills.length === 0) {
    return (
      <div className="text-center py-10 col-span-2">
        <p className="text-white/60">No technical skills found. Add some in the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {technicalSkills.map((skill, categoryIndex) => (
        <motion.div 
          key={skill.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          className="bg-gradient-to-br from-elvis-dark/80 to-elvis-light/40 rounded-xl border-2 border-elvis-pink/10 p-6"
        >
          <h4 className="text-xl font-bold text-white mb-5 relative inline-block">
            {skill.category}
            <div className="h-px w-full absolute -bottom-1 left-0 bg-gradient-to-r from-elvis-pink via-elvis-purple to-transparent"></div>
          </h4>
          
          <div className="space-y-4 mt-4">
            {skill.skills && skill.skills.map((item, idx) => {
              const skillLevel = generateSkillLevel(idx);
              const icon = getSkillIcon(item);
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: categoryIndex * 0.1 + idx * 0.05 }}
                  className="flex items-center"
                >
                  <div className="flex-shrink-0 mr-3 w-8">
                    {icon}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/90 text-sm">{item}</span>
                      <span className="text-elvis-pink text-xs">{skillLevel}%</span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-elvis-dark/50 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full"
                        initial={{ width: '0%' }}
                        animate={isInView ? { width: `${skillLevel}%` } : { width: '0%' }}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + idx * 0.05 + 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Extra component for animation icon
const Motion: React.FC<{ className: string }> = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 15L12 11L16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default TechnicalSkillsGrid;
